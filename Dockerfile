FROM nginx:1.19.4-alpine

WORKDIR /usr/share/nginx/html

COPY dist .
COPY static ./static
COPY ./scripts/build-env.sh ./build-env.sh

EXPOSE 80

# Add bash
RUN apk add --no-cache bash

# Make shell script executable
RUN chmod +x build-env.sh
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/build-env.sh && nginx -g \"daemon off;\""]