# Use Fedora as the base image
FROM fedora:latest

# Install Python and pip
RUN dnf install -y python3 python3-pip

# Install build dependencies including Python development headers
RUN dnf install -y \
        gcc \
        glibc-devel \
        python3-devel \
        make \
    && dnf clean all

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy API gateway files
COPY api_gateway/ .

# Copy .env file for MongoDB Atlas connection
# COPY api_gateway/src/.env .

# Expose port 4999
EXPOSE 4999

# Command to run the API gateway
CMD ["python3", "src/run_backend.py"]
