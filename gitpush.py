import subprocess
import datetime

def run_git_commands():
    # 1. Get current date and time
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Update Node App: {now}"

    try:
        # 2. git add .
        subprocess.run(["git", "add", "."], check=True)
        
        # 3. git commit -m "date and time"
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        
        # 4. git push
        subprocess.run(["git", "push"], check=True)
        
        print(f"Successfully pushed changes with message: '{commit_message}'")
        
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while executing local Git commands: {e}")
        raise e  # Stop execution if local git fails

def trigger_remote_deploy():
    # Configuration - Update these with your exact GCP details
    instance_name = "lantapan-prod"
    zone = "asia-southeast1-b"
    project = "proj-lantapan"
    remote_path = "/var/www/lictd"  # Path to your Node.js app folder
    pm2_process_name = "webapp"             # The --name you gave your PM2 process

    # Chain the commands together: pull -> install production deps -> build -> restart PM2
    remote_command = (
        f"cd {remote_path} && "
        f"git pull origin main && "
        f"npm install --production && "
        f"npm run build && "                  # Remove this specific line if your app does not have a build step
        f"pm2 restart {pm2_process_name}"
    )


    print(f"🚀 Launching remote build & restart on {instance_name}...")
    
    # Construct the gcloud SSH execution list (Removed shell=True to fix the argument parsing bug)
    gcloud_cmd = [
        "gcloud", "compute", "ssh", instance_name,
        "--zone", zone,
        "--project", project,
        "--command", remote_command
    ]

    try:
        subprocess.run(gcloud_cmd, check=True)
        print("🎉 Deployment completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Remote deployment failed: {e}")
        # Add these two lines to see the real error:
        if e.stderr:
            print(f"Error details:\n{e.stderr.decode()}")


if __name__ == "__main__":
    try:
        run_git_commands()
        trigger_remote_deploy()
    except Exception:
        print("💥 Deployment halted due to an error.")
