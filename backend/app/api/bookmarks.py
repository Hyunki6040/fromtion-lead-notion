"""
북마크 API
북마크 및 폴더 CRUD
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete

from app.core.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.bookmark import Bookmark, BookmarkFolder
from app.schemas.bookmark import (
    BookmarkCreate,
    BookmarkUpdate,
    BookmarkResponse,
    BookmarkListResponse,
    BookmarkProjectInfo,
    BookmarkFolderCreate,
    BookmarkFolderUpdate,
    BookmarkFolderResponse,
    BookmarkFolderListResponse,
    BookmarkCheckResponse,
)
from app.api.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/bookmarks", tags=["북마크"])


# ============ 폴더 API ============

@router.get("/folders", response_model=BookmarkFolderListResponse)
async def list_folders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """폴더 목록 조회"""
    # 폴더 조회 with 북마크 수
    result = await db.execute(
        select(
            BookmarkFolder,
            func.count(Bookmark.bookmark_id).label("bookmark_count")
        )
        .outerjoin(Bookmark, BookmarkFolder.folder_id == Bookmark.folder_id)
        .where(BookmarkFolder.user_id == current_user.user_id)
        .group_by(BookmarkFolder.folder_id)
        .order_by(BookmarkFolder.order_index, BookmarkFolder.created_at)
    )
    rows = result.all()

    folders = [
        BookmarkFolderResponse(
            folder_id=row[0].folder_id,
            name=row[0].name,
            description=row[0].description,
            order_index=row[0].order_index,
            bookmark_count=row[1],
            created_at=row[0].created_at,
        )
        for row in rows
    ]

    return BookmarkFolderListResponse(folders=folders)


@router.post("/folders", response_model=BookmarkFolderResponse, status_code=status.HTTP_201_CREATED)
async def create_folder(
    folder_data: BookmarkFolderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """폴더 생성"""
    # 최대 order_index 조회
    result = await db.execute(
        select(func.max(BookmarkFolder.order_index))
        .where(BookmarkFolder.user_id == current_user.user_id)
    )
    max_order = result.scalar() or 0

    folder = BookmarkFolder(
        user_id=current_user.user_id,
        name=folder_data.name,
        description=folder_data.description,
        order_index=max_order + 1,
    )

    db.add(folder)
    await db.commit()
    await db.refresh(folder)

    return BookmarkFolderResponse(
        folder_id=folder.folder_id,
        name=folder.name,
        description=folder.description,
        order_index=folder.order_index,
        bookmark_count=0,
        created_at=folder.created_at,
    )


@router.put("/folders/{folder_id}", response_model=BookmarkFolderResponse)
async def update_folder(
    folder_id: str,
    folder_data: BookmarkFolderUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """폴더 수정"""
    result = await db.execute(
        select(BookmarkFolder)
        .where(BookmarkFolder.folder_id == folder_id)
        .where(BookmarkFolder.user_id == current_user.user_id)
    )
    folder = result.scalar_one_or_none()

    if folder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="폴더를 찾을 수 없습니다.",
        )

    update_data = folder_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(folder, field, value)

    await db.commit()
    await db.refresh(folder)

    # 북마크 수 조회
    count_result = await db.execute(
        select(func.count(Bookmark.bookmark_id))
        .where(Bookmark.folder_id == folder_id)
    )
    bookmark_count = count_result.scalar() or 0

    return BookmarkFolderResponse(
        folder_id=folder.folder_id,
        name=folder.name,
        description=folder.description,
        order_index=folder.order_index,
        bookmark_count=bookmark_count,
        created_at=folder.created_at,
    )


@router.delete("/folders/{folder_id}")
async def delete_folder(
    folder_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """폴더 삭제 (북마크는 기본 폴더로 이동)"""
    result = await db.execute(
        select(BookmarkFolder)
        .where(BookmarkFolder.folder_id == folder_id)
        .where(BookmarkFolder.user_id == current_user.user_id)
    )
    folder = result.scalar_one_or_none()

    if folder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="폴더를 찾을 수 없습니다.",
        )

    # 해당 폴더의 북마크는 folder_id를 null로 설정 (기본 폴더로 이동)
    await db.execute(
        Bookmark.__table__.update()
        .where(Bookmark.folder_id == folder_id)
        .values(folder_id=None)
    )

    await db.delete(folder)
    await db.commit()

    return {"success": True}


# ============ 북마크 API ============

@router.get("", response_model=BookmarkListResponse)
async def list_bookmarks(
    folder_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """북마크 목록 조회"""
    query = (
        select(Bookmark, Project)
        .join(Project, Bookmark.project_id == Project.project_id)
        .where(Bookmark.user_id == current_user.user_id)
        .where(Project.deleted_at.is_(None))
        .order_by(Bookmark.created_at.desc())
    )

    if folder_id is not None:
        if folder_id == "default":
            query = query.where(Bookmark.folder_id.is_(None))
        else:
            query = query.where(Bookmark.folder_id == folder_id)

    result = await db.execute(query)
    rows = result.all()

    bookmarks = [
        BookmarkResponse(
            bookmark_id=row[0].bookmark_id,
            project=BookmarkProjectInfo(
                project_id=row[1].project_id,
                name=row[1].name,
                notion_url=row[1].notion_url,
                public_slug=row[1].public_slug,
            ),
            folder_id=row[0].folder_id,
            name=row[0].name,
            memo=row[0].memo,
            created_at=row[0].created_at,
        )
        for row in rows
    ]

    return BookmarkListResponse(bookmarks=bookmarks, total=len(bookmarks))


@router.post("", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def create_bookmark(
    bookmark_data: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """북마크 추가"""
    # 프로젝트 존재 확인
    result = await db.execute(
        select(Project)
        .where(Project.project_id == bookmark_data.project_id)
        .where(Project.deleted_at.is_(None))
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로젝트를 찾을 수 없습니다.",
        )

    # 이미 북마크 되어있는지 확인
    existing = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == current_user.user_id)
        .where(Bookmark.project_id == bookmark_data.project_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 저장된 콘텐츠입니다.",
        )

    # 폴더 존재 확인 (지정된 경우)
    if bookmark_data.folder_id:
        folder_result = await db.execute(
            select(BookmarkFolder)
            .where(BookmarkFolder.folder_id == bookmark_data.folder_id)
            .where(BookmarkFolder.user_id == current_user.user_id)
        )
        if folder_result.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="폴더를 찾을 수 없습니다.",
            )

    bookmark = Bookmark(
        user_id=current_user.user_id,
        project_id=bookmark_data.project_id,
        folder_id=bookmark_data.folder_id,
        name=bookmark_data.name,
        memo=bookmark_data.memo,
    )

    db.add(bookmark)
    await db.commit()
    await db.refresh(bookmark)

    return BookmarkResponse(
        bookmark_id=bookmark.bookmark_id,
        project=BookmarkProjectInfo(
            project_id=project.project_id,
            name=project.name,
            notion_url=project.notion_url,
            public_slug=project.public_slug,
        ),
        folder_id=bookmark.folder_id,
        name=bookmark.name,
        memo=bookmark.memo,
        created_at=bookmark.created_at,
    )


@router.get("/check/{project_id}", response_model=BookmarkCheckResponse)
async def check_bookmark(
    project_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """북마크 여부 확인"""
    if current_user is None:
        return BookmarkCheckResponse(is_bookmarked=False)

    result = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == current_user.user_id)
        .where(Bookmark.project_id == project_id)
    )
    bookmark = result.scalar_one_or_none()

    if bookmark:
        return BookmarkCheckResponse(
            is_bookmarked=True,
            bookmark_id=bookmark.bookmark_id,
            folder_id=bookmark.folder_id,
        )

    return BookmarkCheckResponse(is_bookmarked=False)


@router.put("/{bookmark_id}", response_model=BookmarkResponse)
async def update_bookmark(
    bookmark_id: str,
    bookmark_data: BookmarkUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """북마크 수정 (폴더 이동, 이름 변경, 메모 수정)"""
    result = await db.execute(
        select(Bookmark, Project)
        .join(Project, Bookmark.project_id == Project.project_id)
        .where(Bookmark.bookmark_id == bookmark_id)
        .where(Bookmark.user_id == current_user.user_id)
    )
    row = result.first()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="북마크를 찾을 수 없습니다.",
        )

    bookmark, project = row

    # 폴더 존재 확인 (지정된 경우)
    if bookmark_data.folder_id:
        folder_result = await db.execute(
            select(BookmarkFolder)
            .where(BookmarkFolder.folder_id == bookmark_data.folder_id)
            .where(BookmarkFolder.user_id == current_user.user_id)
        )
        if folder_result.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="폴더를 찾을 수 없습니다.",
            )

    update_data = bookmark_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(bookmark, field, value)

    await db.commit()
    await db.refresh(bookmark)

    return BookmarkResponse(
        bookmark_id=bookmark.bookmark_id,
        project=BookmarkProjectInfo(
            project_id=project.project_id,
            name=project.name,
            notion_url=project.notion_url,
            public_slug=project.public_slug,
        ),
        folder_id=bookmark.folder_id,
        name=bookmark.name,
        memo=bookmark.memo,
        created_at=bookmark.created_at,
    )


@router.delete("/{bookmark_id}")
async def delete_bookmark(
    bookmark_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """북마크 삭제"""
    result = await db.execute(
        select(Bookmark)
        .where(Bookmark.bookmark_id == bookmark_id)
        .where(Bookmark.user_id == current_user.user_id)
    )
    bookmark = result.scalar_one_or_none()

    if bookmark is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="북마크를 찾을 수 없습니다.",
        )

    await db.delete(bookmark)
    await db.commit()

    return {"success": True}


@router.delete("/project/{project_id}")
async def delete_bookmark_by_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트 ID로 북마크 삭제"""
    result = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == current_user.user_id)
        .where(Bookmark.project_id == project_id)
    )
    bookmark = result.scalar_one_or_none()

    if bookmark is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="북마크를 찾을 수 없습니다.",
        )

    await db.delete(bookmark)
    await db.commit()

    return {"success": True}
