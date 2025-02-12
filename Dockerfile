# Use Debian Bullseye as the base image
FROM debian:bullseye

# Set Asterisk version as an environment variable for convenience
ENV ASTERISK_VERSION=22.2.0

# Install packages required for building Asterisk, plus Python and basic tools.
# (Additional Asterisk dependencies are installed by the provided Asterisk script.)
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    git \
    subversion \
    libssl-dev \
    libncurses5-dev \
    uuid-dev \
    libxml2-dev \
    libsqlite3-dev \
    libjansson-dev \
    libedit-dev \
    libldns-dev \
    libsrtp2-dev \
    curl \
    gnupg \
    python3 \
    python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js using NodeSource (here we use Node.js 18.x; change if needed)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Download and extract the Asterisk source tarball for the specified version
RUN wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-${ASTERISK_VERSION}.tar.gz && \
    tar xvf asterisk-${ASTERISK_VERSION}.tar.gz && \
    rm asterisk-${ASTERISK_VERSION}.tar.gz

# Change working directory to the Asterisk source folder
WORKDIR /asterisk-${ASTERISK_VERSION}

# (Optional) Install additional prerequisites via the Asterisk script
# RUN contrib/scripts/install_prereq install

# Configure Asterisk (using bundled jansson, for example), compile and install
RUN ./configure --with-jansson-bundled && \
    make -j"$(nproc)" && \
    make install && \
    make samples

###
# Copy your local config/logs/audio/AGI directories into the image
# (Omit these COPY lines if you only intend to mount volumes at runtime)
###
COPY asterisk_conf/ /etc/asterisk/
COPY asterisk_logs/ /var/log/asterisk/
COPY sounds/        /var/lib/asterisk/sounds/
COPY agi-bin/       /var/lib/asterisk/agi-bin/

# Declare volumes so you can override them at runtime using `-v`
VOLUME ["/etc/asterisk", "/var/log/asterisk", "/var/lib/asterisk/sounds", "/var/lib/asterisk/agi-bin"]

# Expose ports that Asterisk might use (modify as needed)
EXPOSE 5060 5061 5038

# Run Asterisk in foreground mode when the container starts
CMD ["asterisk", "-f"]
