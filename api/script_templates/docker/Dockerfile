FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
WORKDIR /api
COPY . .

EXPOSE 8000

ARG DEV=false

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --no-cache gnupg && \
    apk add --update --no-cache postgresql-client geos proj gdal binutils jpeg-dev make && \
    apk add --update --virtual .tmp-build-deps \
        build-base postgresql-dev musl-dev zlib zlib-dev && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
        then /py/bin/pip install -r /tmp/requirements.dev.txt; \
    fi && \
    rm -rf /tmp/ && \
    apk del .tmp-build-deps && \
    adduser \
        --disabled-password \
        {{PROJECT_NAME}}-user && \
    mkdir -p /vol/web/media && \
    mkdir -p /vol/web/static && \
    chown -R {{PROJECT_NAME}}-user:{{PROJECT_NAME}}-user /vol/ && \
    chmod -R 755 /vol && \
    chmod +x entrypoint.sh

ENV PATH="/py/bin:$PATH"
USER {{PROJECT_NAME}}-user
