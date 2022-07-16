FROM node:16-alpine
WORKDIR /app
COPY . .
ENV TZ="Asia/Ho_Chi_Minh"
RUN npm install
CMD ["npm", "run", "serve"]