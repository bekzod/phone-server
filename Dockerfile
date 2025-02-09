# Use the slim variant of Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install build dependencies, including JACK2 development librariesg
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    autoconf \
    automake \
    libtool \
    pkg-config \
    libncurses5-dev \
    libssl-dev \
    libxml2-dev \
    libsqlite3-dev \
    uuid-dev \
    libjansson-dev \
    libedit-dev \
    libjack-jackd2-dev \
 && rm -rf /var/lib/apt/lists/*

# Set the working directory for source downloads/build
WORKDIR /usr/src

# Download and extract Asterisk 22.2.0 source code
RUN wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-22.2.0.tar.gz \
 && tar zxvf asterisk-22.2.0.tar.gz \
 && rm asterisk-22.2.0.tar.gz

# Change directory to the extracted Asterisk source
WORKDIR /usr/src/asterisk-22.2.0

# Configure Asterisk with JACK support, explicitly enable the res_jack module, then build and install
RUN ./configure --with-jack \
 && make menuselect.makeopts \
 && menuselect/menuselect --enable res_jack menuselect.makeopts \
 && make -j$(nproc) \
 && make install \
 && make samples \
 && make config \
 && ldconfig

# Expose ports typically used by Asterisk (SIP and AMI)
EXPOSE 5060/udp 5060/tcp 5038

# By default, launch the Asterisk CLI in verbose mode
CMD ["/usr/sbin/asterisk", "-vvvc"]
