FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install required packages (including JACK libraries and jackd2)
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
    jackd2 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

# Download and extract Asterisk 22.2.0
RUN wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-22.2.0.tar.gz \
 && tar zxvf asterisk-22.2.0.tar.gz \
 && rm asterisk-22.2.0.tar.gz

WORKDIR /usr/src/asterisk-22.2.0

# Run configure with JACK support
RUN ./configure --with-jack

# Generate the menuselect options file
RUN make menuselect.makeopts

# (Optional) Ensure the menuselect script is executable
RUN chmod +x menuselect/menuselect

# Enable the JACK module (res_jack) using menuselect
RUN ./menuselect/menuselect --enable res_jack menuselect.makeopts

# Compile using all available processors
RUN make -j$(nproc)

# Install Asterisk, sample configuration files, set up init scripts, and update linker cache
RUN make install
RUN make samples
RUN make config
RUN ldconfig

EXPOSE 5060/udp 5060/tcp 5038

CMD ["/usr/sbin/asterisk", "-vvvc"]
