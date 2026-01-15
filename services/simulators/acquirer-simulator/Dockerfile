FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN pip install --no-cache-dir fastapi uvicorn[standard] httpx pydantic SQLAlchemy==2.0.32 psycopg2-binary
COPY app /app/app
RUN test -f /app/app/__init__.py || touch /app/app/__init__.py
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8080"]
