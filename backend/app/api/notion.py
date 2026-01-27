# Notion 페이지 데이터 프록시 API
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import re
from urllib.parse import urlparse, parse_qs

router = APIRouter(prefix="/api/notion", tags=["notion"])


class NotionPageRequest(BaseModel):
    url: str


def extract_page_id(url: str) -> str:
    """Notion URL에서 페이지 ID를 추출합니다."""
    try:
        parsed = urlparse(url)
        path = parsed.path.strip("/")
        
        # URL 경로에서 마지막 부분 추출
        parts = path.split("/")
        last_part = parts[-1] if parts else ""
        
        # Notion URL 형식: workspace.notion.site/Page-Title-32hexchars
        # 또는: workspace.notion.site/Page-Title?v=view-id (데이터베이스 뷰)
        
        # 1. 경로에서 32자리 hex UUID 추출 시도
        if "-" in last_part:
            # 마지막 하이픈 뒤의 32자리 hex 찾기
            parts_split = last_part.split("-")
            for part in reversed(parts_split):
                # 32자리 hex인지 확인
                if len(part) == 32 and re.match(r"^[a-f0-9]{32}$", part, re.IGNORECASE):
                    return part
            
            # 전체 문자열에서 32자리 hex 찾기
            hex_pattern = re.search(r"([a-f0-9]{32})", last_part.replace("-", ""), re.IGNORECASE)
            if hex_pattern:
                return hex_pattern.group(1)
        
        # 2. 쿼리 파라미터에서 확인 (데이터베이스 뷰의 경우)
        # 주의: v 파라미터는 뷰 ID이지만, 일부 경우 페이지 ID로 사용될 수 있음
        query_params = parse_qs(parsed.query)
        if "v" in query_params:
            view_id = query_params["v"][0]
            # 하이픈 제거 후 32자리인지 확인
            clean_id = view_id.replace("-", "")
            if len(clean_id) == 32 and re.match(r"^[a-f0-9]{32}$", clean_id, re.IGNORECASE):
                return clean_id
        
        # 3. 경로의 마지막 부분에서 하이픈 제거 후 시도
        clean_path = last_part.replace("-", "")
        if len(clean_path) == 32 and re.match(r"^[a-f0-9]{32}$", clean_path, re.IGNORECASE):
            return clean_path
        
        # 4. 경로 자체를 ID로 사용 (Notion이 때때로 이렇게 사용)
        return last_part.replace("-", "")
        
    except Exception as e:
        print(f"URL 파싱 오류: {e}")
        return ""


def format_page_id(page_id: str) -> str:
    """페이지 ID를 UUID 형식으로 변환합니다."""
    # 이미 하이픈이 있으면 그대로 반환
    if "-" in page_id:
        return page_id
    # 32자리 hex를 UUID 형식으로 변환
    if len(page_id) == 32:
        return f"{page_id[:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
    return page_id


@router.post("/page")
async def get_notion_page(request: NotionPageRequest):
    """
    Notion URL로부터 페이지 데이터를 가져옵니다.
    react-notion-x가 사용할 수 있는 형식으로 반환합니다.
    """
    page_id = extract_page_id(request.url)
    
    if not page_id:
        raise HTTPException(status_code=400, detail="유효한 Notion URL이 아닙니다.")
    
    formatted_id = format_page_id(page_id)
    
    # 여러 Notion API 엔드포인트를 시도 (fallback)
    api_endpoints = [
        f"https://notion-api.splitbee.io/v1/page/{formatted_id}",
        f"https://notion-api.vercel.app/v1/page/{formatted_id}",
    ]
    
    last_error = None
    
    for notion_api_url in api_endpoints:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(notion_api_url)
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "page_id": formatted_id,
                        "recordMap": response.json(),
                    }
                elif response.status_code == 404:
                    # 404는 계속 시도하지 않고 즉시 반환
                    # 마지막 API인 경우에만 에러 반환
                    if notion_api_url == api_endpoints[-1]:
                        raise HTTPException(
                            status_code=404,
                            detail=f"Notion 페이지를 찾을 수 없습니다. (페이지 ID: {formatted_id})\n\n다음을 확인해주세요:\n1. Notion 페이지가 '웹에 게시' 상태인지 확인\n2. 페이지 URL이 올바른지 확인\n3. 데이터베이스 뷰가 아닌 실제 페이지 URL을 사용해주세요"
                        )
                    continue
                elif response.status_code == 403:
                    # 403은 다음 API를 시도
                    last_error = f"접근이 거부되었습니다 (403). 페이지가 공개되어 있는지 확인해주세요."
                    continue
                else:
                    # 다른 에러도 다음 API를 시도
                    last_error = f"오류 발생: {response.status_code}"
                    continue
        except httpx.TimeoutException:
            last_error = "Notion 서버 응답 시간이 초과되었습니다."
            continue
        except HTTPException:
            # 404는 즉시 전파
            raise
        except httpx.RequestError as e:
            last_error = f"Notion 서버 연결 실패: {str(e)}"
            continue
    
    # 모든 API 시도 실패
    raise HTTPException(
        status_code=502,
        detail=f"Notion 페이지를 불러올 수 없습니다. {last_error} 페이지가 '웹에 게시' 상태인지 확인해주세요."
    )


@router.get("/page/{page_id}")
async def get_notion_page_by_id(page_id: str):
    """
    페이지 ID로 직접 Notion 페이지 데이터를 가져옵니다.
    """
    formatted_id = format_page_id(page_id)
    
    # 여러 Notion API 엔드포인트를 시도 (fallback)
    api_endpoints = [
        f"https://notion-api.splitbee.io/v1/page/{formatted_id}",
        f"https://notion-api.vercel.app/v1/page/{formatted_id}",
    ]
    
    last_error = None
    
    for notion_api_url in api_endpoints:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(notion_api_url)
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "page_id": formatted_id,
                        "recordMap": response.json(),
                    }
                elif response.status_code == 404:
                    raise HTTPException(
                        status_code=404,
                        detail="Notion 페이지를 찾을 수 없습니다."
                    )
                elif response.status_code == 403:
                    last_error = "접근이 거부되었습니다 (403)."
                    continue
                else:
                    last_error = f"오류: {response.status_code}"
                    continue
        except httpx.TimeoutException:
            last_error = "시간 초과"
            continue
        except HTTPException:
            raise
        except httpx.RequestError as e:
            last_error = str(e)
            continue
    
    raise HTTPException(
        status_code=502,
        detail=f"Notion 페이지를 불러올 수 없습니다. {last_error}"
    )

