##### Build and run the image resizer

1. Build the image

```bash
docker build --progress=plain -t image-resizer .
```

2. Run the image with the following command

```
docker run --rm -v $(pwd)/outfiles:/outfiles image-resizer
```
