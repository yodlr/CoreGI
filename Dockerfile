FROM speakit/nodejs

MAINTAINER Jared De La Cruz <jared@speakit.io>

RUN apt-get -qq update
RUN apt-get install -yqq wget ca-certificates build-essential

RUN apt-get install -yqq git mercurial

# Install go
ENV PATH $PATH:/usr/local/go/bin
ENV GOPATH /usr/local/go/

RUN wget --no-verbose https://storage.googleapis.com/golang/go1.3.3.src.tar.gz
RUN tar -v -C /usr/local -xzf go1.3.3.src.tar.gz
RUN cd /usr/local/go/src && ./all.bash --no-clean 2>&1

# Install Fleet
RUN cd /root && \
    git clone https://github.com/coreos/fleet.git && \
    cd fleet && \
    ./build

RUN ln -s /root/fleet/bin/fleetctl /usr/bin/fleetctl

# Install app
WORKDIR /src

ADD package.json /src/package.json
RUN npm install

ADD bower.json /src/bower.json
RUN bower install --allow-root

ADD gulpfile.js /src/gulpfile.js
RUN gulp

EXPOSE 3000

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD . /src/

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
