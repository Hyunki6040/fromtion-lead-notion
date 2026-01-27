# 데이터베이스 마이그레이션 가이드

## 개요

FORMTION은 SQLite를 사용하며, 모델 변경 시 데이터베이스 스키마를 업데이트해야 합니다. 이 문서는 마이그레이션 개발 방법을 설명합니다.

## 마이그레이션이 필요한 경우

다음과 같은 경우 마이그레이션이 필요합니다:

1. **새 컬럼 추가**: 모델에 새 필드가 추가된 경우
2. **컬럼 삭제**: 모델에서 필드가 제거된 경우 (주의: 데이터 손실)
3. **컬럼 타입 변경**: 기존 컬럼의 데이터 타입이 변경된 경우
4. **제약 조건 변경**: UNIQUE, NOT NULL 등 제약 조건이 변경된 경우

## 마이그레이션 개발 프로세스

### 1. 모델 수정

먼저 `backend/app/models/` 디렉토리의 모델 파일을 수정합니다.

**예시: `backend/app/models/project.py`**

```python
class Project(Base):
    __tablename__ = "projects"
    
    # 기존 필드
    project_id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    
    # 새로 추가할 필드
    description = Column(String(500), nullable=True)  # 새 컬럼
```

### 2. 마이그레이션 스크립트 작성

`backend/migrate_db.py` 파일을 참고하여 마이그레이션 스크립트를 작성합니다.

**기본 구조**:

```python
async def migrate_database():
    """데이터베이스 스키마 마이그레이션"""
    print("🔄 데이터베이스 마이그레이션 시작...")
    
    async with engine.begin() as conn:
        # 1. 테이블 정보 확인
        result = await conn.execute(
            text("PRAGMA table_info(projects)")
        )
        columns = {row[1]: row for row in result.fetchall()}
        
        # 2. 새 컬럼 추가 (없는 경우)
        if "description" not in columns:
            print("📝 projects 테이블에 description 컬럼 추가 중...")
            await conn.execute(
                text("""
                    ALTER TABLE projects 
                    ADD COLUMN description TEXT
                """)
            )
            print("✅ description 컬럼이 추가되었습니다.")
        
        # 3. 기존 데이터 처리 (필요한 경우)
        # 예: 기본값 설정, 데이터 변환 등
```

### 3. 마이그레이션 스크립트 실행

#### 개발 환경

```bash
cd backend
uv run python migrate_db.py
```

#### 프로덕션 환경

```bash
cd backend
# 백업 권장
cp formtion.db formtion.db.backup

# 마이그레이션 실행
uv run python migrate_db.py
```

### 4. 자동 마이그레이션 설정

`start-dev.sh`와 `start.sh`에는 자동 마이그레이션이 포함되어 있습니다:

```bash
# start-dev.sh / start.sh
if [ -f "formtion.db" ]; then
    echo "📊 데이터베이스 마이그레이션 확인 중..."
    cd "$BACKEND_DIR"
    uv run python migrate_db.py || echo "  마이그레이션 스크립트가 없습니다. (무시 가능)"
fi
```

## 참고 파일

마이그레이션 개발 시 다음 파일들을 참고하세요:

### 핵심 파일

1. **`backend/migrate_db.py`**
   - 마이그레이션 스크립트
   - 실제 마이그레이션 로직이 구현된 파일
   - 컬럼 추가, 제거, 데이터 변환 등

2. **`backend/app/core/database.py`**
   - 데이터베이스 연결 및 초기화 로직
   - `init_db()`: 테이블 생성 함수
   - `Base`: SQLAlchemy 모델 베이스 클래스

3. **`backend/app/models/`**
   - 모든 SQLAlchemy 모델 정의
   - 모델 변경 시 여기를 먼저 수정
   - 예: `user.py`, `project.py`, `lead.py`, `event_log.py`

4. **`backend/app/main.py`**
   - 애플리케이션 시작 시 `init_db()` 호출
   - 라이프사이클 관리

### 관련 설정 파일

5. **`backend/app/core/config.py`**
   - 데이터베이스 URL 설정
   - `DATABASE_URL` 환경 변수

6. **`start-dev.sh` / `start.sh`**
   - 서버 시작 스크립트
   - 자동 마이그레이션 실행

## SQLite 마이그레이션 제약사항

SQLite는 ALTER TABLE 명령이 제한적입니다. 다음 작업만 가능합니다:

### 가능한 작업

1. **새 컬럼 추가** (테이블 끝에만)
   ```sql
   ALTER TABLE table_name ADD COLUMN column_name TYPE;
   ```

2. **테이블 이름 변경**
   ```sql
   ALTER TABLE old_name RENAME TO new_name;
   ```

### 불가능한 작업

1. 컬럼 삭제
2. 컬럼 타입 변경
3. 컬럼 순서 변경
4. NOT NULL 제약 조건 추가 (기본값 없이)
5. UNIQUE 제약 조건 추가

### 제약사항 해결 방법

복잡한 변경이 필요한 경우:

1. **새 테이블 생성**: 변경된 스키마로 새 테이블 생성
2. **데이터 마이그레이션**: 기존 데이터를 새 테이블로 복사
3. **테이블 교체**: 기존 테이블 삭제, 새 테이블 이름 변경

**예시**:

```python
# 1. 새 테이블 생성
await conn.execute(text("""
    CREATE TABLE projects_new (
        project_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,  -- 새 컬럼
        ...
    )
"""))

# 2. 데이터 복사
await conn.execute(text("""
    INSERT INTO projects_new 
    SELECT project_id, name, NULL as description, ...
    FROM projects
"""))

# 3. 기존 테이블 삭제 및 교체
await conn.execute(text("DROP TABLE projects"))
await conn.execute(text("ALTER TABLE projects_new RENAME TO projects"))
```

## 마이그레이션 체크리스트

새 마이그레이션을 작성할 때:

- [ ] 모델 파일 수정 확인 (`backend/app/models/`)
- [ ] 마이그레이션 스크립트 작성 (`backend/migrate_db.py`)
- [ ] 기존 데이터 보존 확인
- [ ] 기본값 설정 확인 (NOT NULL 컬럼의 경우)
- [ ] 개발 환경에서 테스트
- [ ] 문서 업데이트 (필요한 경우)

## 데이터베이스 재생성 (개발 환경)

개발 환경에서 스키마를 완전히 재생성하려면:

```bash
cd backend
rm formtion.db
# 서버 재시작 시 자동으로 새로 생성됩니다
```

**주의**: 프로덕션 환경에서는 절대 사용하지 마세요. 모든 데이터가 삭제됩니다.

## 트러블슈팅

### 에러: "no such column: ..."

**원인**: 마이그레이션이 실행되지 않았거나, 모델과 DB 스키마가 불일치

**해결**:
```bash
cd backend
uv run python migrate_db.py
```

### 에러: "table already exists"

**원인**: 마이그레이션이 이미 실행되었거나, DB가 이미 존재

**해결**: 마이그레이션 스크립트에서 컬럼 존재 여부를 확인하도록 수정

### 데이터 손실 방지

마이그레이션 전 항상 백업:

```bash
cp backend/formtion.db backend/formtion.db.backup
```

## 예시: theme_config 컬럼 추가

실제 구현 예시 (`backend/migrate_db.py` 참고):

```python
async def migrate_database():
    async with engine.begin() as conn:
        # 테이블 정보 확인
        result = await conn.execute(
            text("PRAGMA table_info(projects)")
        )
        columns = {row[1]: row for row in result.fetchall()}
        
        # theme_config 컬럼 추가
        if "theme_config" not in columns:
            await conn.execute(
                text("""
                    ALTER TABLE projects 
                    ADD COLUMN theme_config TEXT 
                    DEFAULT '{"primary_color": "#FF5A1F"}'
                """)
            )
        
        # 기존 레코드에 기본값 설정
        await conn.execute(
            text("""
                UPDATE projects 
                SET theme_config = '{"primary_color": "#FF5A1F"}' 
                WHERE theme_config IS NULL OR theme_config = ''
            """)
        )
```

## 추가 리소스

- [SQLite ALTER TABLE 문서](https://www.sqlite.org/lang_altertable.html)
- [SQLAlchemy 문서](https://docs.sqlalchemy.org/)
- [FastAPI 데이터베이스 가이드](https://fastapi.tiangolo.com/tutorial/sql-databases/)

