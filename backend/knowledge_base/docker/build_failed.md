# Docker Build Failed

## Error Message
```
Step 5/10 : RUN npm install
ERROR: failed to solve: process "/bin/sh -c npm install" did not complete successfully: exit code: 1
```

## Symptoms
- docker build exits with non-zero code
- Build stops at a specific RUN instruction
- Image is not created

## Root Cause
A command inside the Dockerfile failed during the build process.

## Possible Reasons
- Package installation failed (npm install, pip install, apt-get)
- Network issue during build
- Missing build dependencies (gcc, make, etc.)
- Syntax error in Dockerfile
- File not found in COPY instruction

## Diagnostic Commands
```bash
docker build --no-cache -t myapp . 2>&1
docker build --progress=plain -t myapp .
docker run -it <base-image> /bin/sh
```

## Fix Steps
1. Read the full error output
2. Run the failing command manually inside the base image
3. For npm: RUN npm cache clean --force && npm install
4. For pip: RUN pip install --upgrade pip && pip install -r requirements.txt
5. For apt-get: add apt-get update before apt-get install

## Severity
High

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
