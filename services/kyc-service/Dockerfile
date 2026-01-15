FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN pip install --no-cache-dir fastapi uvicorn[standard] pydantic httpx requests python-jose[cryptography] SQLAlchemy psycopg2-binary reportlab
COPY app /app
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8080"]
