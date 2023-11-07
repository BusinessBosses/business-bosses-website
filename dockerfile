# Stage 1: Build the React app
FROM node:latest as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve the React app
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will listen on
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
