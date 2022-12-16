FROM node:16.17.1 AS builder
WORKDIR /app
## 프로젝트의 모든 파일을 WORKDIR(/app)로 복사한다
COPY . .
## Nest.js project를 build 한다
RUN yarn install
RUN yarn run build


# Step 2
## base image for Step 2: Node 10-alpine(light weight)
FROM node:16.17.1-alpine
WORKDIR /app
## Step 1의 builder에서 build된 프로젝트를 가져온다
# ENV PATH ./env/.dev:$PATH

COPY --from=builder /app ./

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

ENV HISTIGNORE='export DOPPLER_TOKEN*'
ENV DOPPLER_TOKEN='dp.st.prd.3s5mZSHza05yH1zqGEvfIRIqkzDODxVXtC0kflLc37V'


EXPOSE 30005
## application 실행

# ENV db = process.env
# RUN echo ${db}
# 최종 : prod

CMD yarn run start:prod