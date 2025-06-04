# Build stage
FROM golang:1.24.3-alpine3.22 AS builder

WORKDIR /app

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server .
RUN go build -o yabv-be .

# Final image
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/yabv-be .
COPY web/dist ./dist

CMD [ "./yabv-be" ]
