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
    # --- UPDATE THESE CONFIGURATIONS FOR YOUR PUTTY SETUP ---
    hostname = "143.9.5.25" 
    username = "ubuntu"
    # Full path to the private key (.ppk) you use in PuTTY
    ppk_path = r"D:\09LICTD\ngdc\backup\Lantapan\Lantapan\lgulantapan03.ppk"
    
    remote_path = "/var/www/html/lictd"

    # Chains your pull, node modules cleanup, npm install, build, and apache restart
    remote_command = (
        f"cd {remote_path} && "
        f"sudo git pull origin main && "
        f"sudo rm -rf node_modules package-lock.json && "
        f"sudo npm install && "
        f"sudo npm run build && "
        f"sudo systemctl restart apache2"
    )

    print(f"🚀 Triggering pull and build on {hostname} via Plink...")

    try:
        # Uses plink.exe (installed with PuTTY) to run commands remotely
        subprocess.run([
            "plink", 
            "-i", ppk_path, 
            f"{username}@{hostname}", 
            remote_command
        ], check=True)
        print("✅ Remote pull, build, and Apache restart completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to execute remote deployment sequence: {e}")

if __name__ == "__main__":
    # Only triggers the server deployment if the local git push succeeds
    if run_git_commands():
        current_os = platform.system()
        
        if current_os == "Windows":
            print("🪟 Windows detected. Proceeding with remote deployment.")
            trigger_remote_pull()
        elif current_os == "Darwin":
            print("🍏 macOS detected. Skipping remote deployment.")
        else:
            print(f"ℹ️ Other OS detected ({current_os}). Skipping remote deployment.")
