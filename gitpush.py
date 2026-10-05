import subprocess
import datetime
import platform

def run_git_commands():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Update: {now}"

    try:
        # 1. Stage all changes
        subprocess.run(["git", "add", "."], check=True)
        
        # 2. Commit changes with a timestamp
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        
        # 3. Explicitly push to origin main to avoid upstream errors
        print("Pushing changes to GitHub main branch...")
        subprocess.run(["git", "push", "origin", "main"], check=True)
        
        print(f"Successfully pushed changes with message: '{commit_message}'")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ An error occurred while executing Git commands: {e}")
        return False

def trigger_remote_pull():
    # --- CONFIGURATIONS FOR YOUR PUTTY SETUP ---
    hostname = "143.9.5.25" 
    username = "ubuntu"
    ppk_path = r"D:\09LICTD\ngdc\backup\Lantapan\Lantapan\lgulantapan03.ppk"
    
    remote_path = "/var/www/html/lictd"

    # Pull latest code, install dependencies, build Next.js, and reload PM2
    remote_command = (
        f"cd {remote_path} && "
        f"git pull origin main && "
        f"npm install && "
        f"npm run build && "
        f"pm2 reload all --update-env"
    )

    print(f"🚀 Triggering pull, build, and PM2 reload on {hostname} via Plink...")

    try:
        # Uses plink.exe to run commands remotely
        subprocess.run([
            "plink", 
            "-i", ppk_path, 
            f"{username}@{hostname}", 
            remote_command
        ], check=True)
        print("✅ Remote pull, Next.js build, and PM2 reload completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to execute remote deployment sequence: {e}")

if __name__ == "__main__":
    if run_git_commands():
        current_os = platform.system()
        
        if current_os == "Windows":
            print("🪟 Windows detected. Proceeding with remote deployment.")
            trigger_remote_pull()
        elif current_os == "Darwin":
            print("🍏 macOS detected. Skipping remote deployment.")
        else:
            print(f"ℹ️️ Other OS detected ({current_os}). Skipping remote deployment.")