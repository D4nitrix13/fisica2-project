#

```bash
sudo pacman -Rns cuda cudnn ninja --noconfirm

```

---

<https://ollama.com/download/linux>
<https://ollama.com/library/deepseek-r1>

curl -fsSL <https://ollama.com/install.sh> | sh

ollama run deepseek-r1

```bash
curl -fsSL https://ollama.com/install.sh | sh
>>> Installing ollama to /usr/local
>>> Downloading Linux amd64 bundle
######################################################################## 100.0%
>>> Creating ollama user...
>>> Adding ollama user to render group...
>>> Adding ollama user to video group...
>>> Adding current user to ollama group...
>>> Creating ollama systemd service...
>>> Enabling and starting ollama service...
Created symlink '/etc/systemd/system/default.target.wants/ollama.service' → '/etc/systemd/system/ollama.service'.
>>> NVIDIA GPU installed.
```
