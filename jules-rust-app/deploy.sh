#!/bin/bash

# Using npx vercel since global vercel is not found
# save stdout and stderr to files
npx -y vercel deploy --yes >deployment-url.txt 2>error.txt
 
# check the exit code
code=$?
if [ $code -eq 0 ]; then
    # Now you can use the deployment url from stdout for the next step of your workflow
    deploymentUrl=`cat deployment-url.txt`
    echo "Deployment URL: $deploymentUrl"
    
    # Attempting alias as requested (note: my-custom-domain.com will likely fail validation)
    npx vercel alias $deploymentUrl my-custom-domain.com
else
    # Handle the error
    errorMessage=`cat error.txt`
    echo "There was an error: $errorMessage"
fi
