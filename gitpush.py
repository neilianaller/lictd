import subprocess
import datetime
import platform

def run_git_commands():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Update: {now}"

    try:
        # 1. Stage changes
        subprocess.run(["git", "add", "."], check=True)
        
        # 2. Commit changes
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        
        # 3. Push and set upstream explicitly to main
        print("Pushing changes to remote main branch...")
        subprocess.run(["git", "push"], check=True)
        
        print(f"Successfully pushed changes with message: '{commit_message}'")
        return True
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while executing Git commands: {e}")
        return False

def trigger_remote_pull():
    instance_name = "biometrics-prod"
    zone = "asia-southeast1-b"
    project = "proj-lantapan"
    remote_path = "/var/www/html/lictd"

    # Enforced 'main' branch for the remote server pull
    remote_command = f"cd {remote_path} && sudo git pull origin main"

    print(f"🚀 Triggering pull on {instance_name}...")
    
    subprocess.run([
        "gcloud", "compute", "ssh", instance_name,
        "--zone", zone,
        "--project", project,
        "--command", remote_command
    ], shell=True)


if __name__ == "__main__":
    if run_git_commands():
        current_os = platform.system()
        
        if current_os == "Windows":
            print("🪟 Windows detected. Proceeding with remote pull.")
            trigger_remote_pull()
        elif current_os == "Darwin":
            print("🍏 macOS detected. Skipping remote pull.")
        else:
            print(f"ℹ️ Other OS detected ({current_os}). Skipping remote pull.")
