# LEARNED: Docker on Mac Studio M4 Max

**Date:** 2026-05-28
**Hardware:** Mac Studio (Apple M4 Max, 64 GB RAM)
**Status:** ✅ WORKING — Docker Desktop 4.67.0 with Rosetta 2 translation

## Docker Desktop Version

- **Version:** Docker Desktop 4.67.0 (build 222858)
- **Engine:** Docker Engine 29.3.1
- **CLI:** Homebrew `docker` 29.5.2 (client only)
- **Kernel:** Linux 6.12.76-linuxkit (inside Docker Desktop VM)

## Architecture

Docker Desktop on Mac Studio M4 Max runs a **Linux VM** (x86_64) under the hood. This is by design:
- macOS hypervisor (`hypervisor.framework`) manages a lightweight Linux VM
- Docker daemon and containers run inside that Linux VM
- The macOS app and CLI are translated (Intel → ARM) via Rosetta 2

```
Mac Studio M4 Max (ARM64)
  └── Docker Desktop App (x86_64, Rosetta 2 translated)
        └── Linux VM (x86_64, managed by hypervisor.framework)
              ├── Docker Engine 29.3.1
              ├── containerd
              └── Containers (searxng, valkey)
```

**This is normal and fully supported.** Docker Desktop for Apple Silicon uses the same Linux VM approach — not native ARM64 containers. The VM provides hardware virtualization for the Linux kernel.

## Running Containers

```
CONTAINER ID   IMAGE                 STATUS       PORTS
a0cd4d51db14   valkey/valkey:9-alpine   Up 3 hours   6379/tcp
9d9feb3371c8   searxng/searxng:latest   Up 3 hours   127.0.0.1:8080->8080/tcp
```

Both containers are **amd64** (x86_64) Linux containers — they run transparently inside the Linux VM.

## SearXNG (LBC35 Search)

- **Port:** 127.0.0.1:8080
- **Status:** ✅ Running, responding
- **Version:** searxng/2026.4.3+53141be38
- **Health check:** `curl localhost:8080` returns SearXNG HTML ✅
- **Valkey (cache):** 127.0.0.1:6379 ✅

## ARM64 Containers Note

If you later want native ARM64 containers (better performance on M4):
```bash
docker buildx build --platform linux/arm64 -t my-image:arm64 .
docker run --platform linux/arm64 my-image:arm64
```

However, there is **no performance issue** with amd64 containers on this setup — the Linux VM runs Docker natively, and Rosetta translation only affects the macOS host-side CLI, not the container workloads.

## Disk Space

Docker Desktop allocates disk space from your Mac Studio's SSD. Current containers are lightweight (SearXNG: 382 MB, Valkey: 63.5 MB). No action needed.

## Docker CLI vs Docker Desktop

- **Docker Desktop** (`/Applications/Docker.app`) — the GUI app that manages the Linux VM
- **Docker CLI** (`/usr/local/bin/docker`) — Homebrew-installed client, connects to Docker Desktop's daemon via `desktop-linux` context

```bash
docker context ls
# desktop-linux  *  Current
# default         DOCKER_HOST based
```

## Migration Notes

- Docker Desktop on the Intel Mac mini used the same Linux VM architecture
- Settings, images, and container data in `~/Library/Containers/com.docker.docker/` transferred with Time Machine or manual copy
- No Docker-specific migration steps needed — the app auto-detects the Apple Silicon hardware

## Verdict

✅ **Docker is fully operational on Mac Studio M4 Max.**
- Linux VM approach is correct and native to Docker Desktop for Mac
- All containers running normally (SearXNG, Valkey)
- No AMD64/ARM64 conflict — containers run inside the VM transparently
- Rosetta 2 only translates the macOS host CLI, not workloads
