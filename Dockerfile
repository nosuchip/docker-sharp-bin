# Stage 1: Build libvips and sharp
FROM node:20-alpine3.18 AS builder

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    pkgconfig \
    glib-dev \
    expat-dev \
    libjpeg-turbo-dev \
    tiff-dev \
    gobject-introspection-dev \
    libgsf-dev \
    libpng-dev \
    libwebp-dev \
    libheif-dev \
    git \
    meson \
    ninja \
    curl \
    python3

# Clone and build libvips
RUN git clone https://github.com/libvips/libvips.git && \
    cd libvips && \
    meson setup build-dir --prefix=/usr --libdir=lib --buildtype=release \
    -Ddeprecated=false \
    -Dheif=enabled \
    -Djpeg=enabled \
    -Dpng=enabled \
    -Dtiff=enabled \
    -Dwebp=enabled \
    -Dmodules=enabled \
    -Dintrospection=auto \
    -Dfuzzing_engine=none && \
    ninja -C build-dir && \
    ninja -C build-dir install

# Prepare app directory
WORKDIR /app

# Copy package.json and install dependencies including sharp
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn add --ignore-engines @img/sharp-linuxmusl-x64

COPY . .
RUN yarn build

# Install app dependencies, including sharp, and rebuild sharp
# RUN npm install && \
#     npm rebuild --platform=linuxmusl --arch=x64 sharp
RUN yarn && yarn add --ignore-engines @img/sharp-linuxmusl-x64

################################################################

# Stage 2: Final runtime image
FROM node:20-alpine3.18 AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    libjpeg-turbo \
    tiff \
    gobject-introspection \
    libgsf \
    libpng \
    libwebp \
    libheif \
    expat \
    curl

# Copy libvips and sharp from the builder stage
COPY --from=builder /usr/lib /usr/lib
COPY --from=builder /usr/include /usr/include
COPY --from=builder /usr/bin /usr/bin
COPY --from=builder /usr/share /usr/share
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/

WORKDIR /

# Copy the application code
COPY --from=builder /app/node_modules /node_modules
COPY --from=builder /app/dist /dist

# Command to run your script
# CMD ["node", "/dist/main.js"]
CMD ["node", "/dist/cli.js"]
