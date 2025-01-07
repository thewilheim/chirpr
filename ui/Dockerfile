FROM node:18-alpine

# Define build arguments for environment variables
ARG VITE_HOST_URL
ARG VITE_BLOB_URL

# Set environment variables during the build process
ENV VITE_HOST_URL=$VITE_HOST_URL
ENV VITE_BLOB_URL=$VITE_BLOB_URL
# Use the environment variable in your build process (optional)
RUN echo "Building with API URL: $VITE_HOST_URL"

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "preview" ]