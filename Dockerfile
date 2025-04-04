# 使用 Node.js 基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY package.json package-lock.json* ./


# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

RUN npm run build:css

# 暴露 WebSocket 端口
EXPOSE 8080

# 启动 WebSocket 服务器
CMD ["node", "server.js"]