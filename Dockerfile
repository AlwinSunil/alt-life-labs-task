# Stage 1: Build the React client
FROM node:alpine AS client-builder

WORKDIR /usr/src/app/client

# Install client dependencies
COPY client/package*.json ./
RUN npm install

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy client source and build the production bundle
COPY client/ ./
RUN npm run build

# Stage 2: Build the production image with the Node.js server
FROM node:alpine

WORKDIR /usr/src/app

# Install OpenSSL 1.1 and other required dependencies
RUN apk add --no-cache openssl zlib &&
    ln -sf /usr/lib/libcrypto.so.1.1 /usr/lib/libcrypto.so &&
    ln -sf /usr/lib/libssl.so.1.1 /usr/lib/libssl.so

# Copy server package files and install production dependencies
COPY ./server/package*.json ./
RUN npm install --omit=dev

# Copy the rest of the server source code
COPY ./server .

# Copy the built React client from the builder stage into a folder (e.g., "public")
COPY --from=client-builder /usr/src/app/client/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the server using your server's entry point
CMD ["node", "index.js"]
