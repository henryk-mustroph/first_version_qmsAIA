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


# Add a step to verify Python environment and installed packages
RUN python3 -m pip list

# Download NLTK data
RUN python3 -m nltk.downloader punkt

# Copy backend files
COPY rms_backend/ .

# Ensure the model download script path is correct
RUN python3 src/verification/models/download_huggingface_models.py

# Expose port 5001
EXPOSE 5001

# Command to run the backend
CMD ["python3", "src/communication/run_backend.py"]