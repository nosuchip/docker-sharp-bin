##### Build and run the image resizer

1. Build the image

```bash
docker build --progress=plain -t image-resizer .
```

2. Run the image with the following command

```
docker run -it --rm -v ./infiles:/infiles -v ./outfiles:/outfiles image-resizer:latest
```
