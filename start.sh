# #!/bin/bash

cd frontend_V1
# Navigate to the frontend directory

# # Ensure dependencies are installed
npm install

# # Build the frontend for production.
npm run build

# # Start the frontend server
# npm run start


# Start the backend
cd ..
gunicorn app:app


echo "Done"