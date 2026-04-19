FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_FACULTY_API_URL=/api/faculty
ARG VITE_STUDENT_API_URL=/api/student
ARG VITE_EVENT_API_URL=/api/event
ENV VITE_FACULTY_API_URL=$VITE_FACULTY_API_URL
ENV VITE_STUDENT_API_URL=$VITE_STUDENT_API_URL
ENV VITE_EVENT_API_URL=$VITE_EVENT_API_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.tmpl
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]