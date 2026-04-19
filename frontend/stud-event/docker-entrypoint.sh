#!/bin/sh
envsubst '${FACULTY_API_URL} ${STUDENT_API_URL} ${EVENT_API_URL}' \
  < /etc/nginx/conf.d/default.conf.tmpl \
  > /etc/nginx/conf.d/default.conf
exec "$@"