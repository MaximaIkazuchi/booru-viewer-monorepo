# Build stage
FROM golang:1.24.3-alpine3.22 AS builder

WORKDIR /app
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN GOPROXY=direct go mod download

COPY . .
RUN go build -o yabv-be .

# Final image
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/yabv-be .

CMD [ "./yabv-be" ]