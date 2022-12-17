FROM node:16.17.1 AS builder

## 프로젝트의 모든 파일을 WORKDIR(/app)로 복사한다
WORKDIR /app
COPY . .

## Nest.js project를 build 한다
RUN yarn install
RUN yarn run build

# Step 2
FROM node:16.17.1-alpine
WORKDIR /app

## Step 1의 builder에서 build된 프로젝트를 가져온다
COPY --from=builder /app ./

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler
ENV HISTIGNORE='export DOPPLER_TOKEN*'
ENV DOPPLER_TOKEN='dp.pt.mzBpwS3b7OmbkEZS5K62hBcdubXB4zChitkW5sf1580'

## application 실행
EXPOSE 3000

CMD yarn run start:dev