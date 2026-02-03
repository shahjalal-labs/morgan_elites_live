# DigitalOcean Spaces Public Access Setup

## Problem
Recording files uploaded by ZEGOCLOUD to DigitalOcean Spaces are private by default, causing "Access Denied" errors.

## Solution: Configure Bucket Permissions

### Method 1: Using DigitalOcean Console (Easiest)

1. Go to https://cloud.digitalocean.com/spaces
2. Select your bucket: **sickleshieldstorage**
3. Click on **Settings** tab
4. Under **Permissions** section:
   - Set **File Listing**: Public
   - This makes all objects in the bucket publicly readable

### Method 2: Using AWS CLI with Bucket Policy (More Control)

**Step 1: Install AWS CLI**
```bash
# Windows (using winget)
winget install Amazon.AWSCLI

# Or download from: https://aws.amazon.com/cli/
```

**Step 2: Configure AWS CLI for DigitalOcean Spaces**
```bash
aws configure --profile digitalocean
# AWS Access Key ID: DO009B6N2L467B34EW9P
# AWS Secret Access Key: CggKFTKgG77hCIkwjJ0zdmHjE1Y1Dr5bC33WpnbTyxY
# Default region name: lon1
# Default output format: json
```

**Step 3: Apply Bucket Policy**
```bash
aws s3api put-bucket-policy --bucket sickleshieldstorage --policy file://bucket-policy.json --endpoint-url https://lon1.digitaloceanspaces.com --profile digitalocean
```

**Step 4: Verify Policy**
```bash
aws s3api get-bucket-policy --bucket sickleshieldstorage --endpoint-url https://lon1.digitaloceanspaces.com --profile digitalocean
```

### Method 3: Fix Existing Files

If you have existing private files that need to be made public:

```bash
# Make all existing recordings public
aws s3 cp s3://sickleshieldstorage/record/ s3://sickleshieldstorage/record/ --recursive --acl public-read --endpoint-url https://lon1.digitaloceanspaces.com --profile digitalocean --metadata-directive REPLACE
```

## Verification

After applying the policy, test with your recording URL:
```
https://sickleshieldstorage.lon1.digitaloceanspaces.com/record/yourfile.mp4
```

It should load without "Access Denied" errors.

## Note

- New recordings will automatically inherit the bucket's public permissions
- The bucket policy in `bucket-policy.json` only makes the `record/` folder public, keeping other files private
- If you want the entire bucket public, use Method 1 (Console)
