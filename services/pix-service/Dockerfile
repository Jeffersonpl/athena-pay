FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN pip install --no-cache-dir fastapi uvicorn[standard] httpx requests pydantic "SQLAlchemy==2.*" psycopg2-binary qrcode[pil] pillow
COPY app /app
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8080"]
