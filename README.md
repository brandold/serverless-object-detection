# serverless-object-recognition

## A (mostly free) serverless object recognition API hosted on AWS

### About

This project uses AWS Lambda and AWS API Gateway in conjunction with OpenCV powered by a (tiny) version of the [YoloV3](https://pjreddie.com/darknet/yolo/) Object
detection system trained on the coco dataset. This architecture enables an event driven, serverless, self-contained 
object detection API that is extremely fast, accurate, and most importantly, nearly free!

The [Chalice Microframework](https://chalice.readthedocs.io/en/latest/) is used for turning the Lambda and API Gateway configuration into Flask style python code.

Currently the API only supports images (png/jpeg).

### Cost

AWS provides us with 400,000 GB seconds of lambda compute and 1 millions requests free every month alongside 1 million API Gateway requests
for a fee of $3.50

My estimates (not including time-bounded free tiers) for processing 100,000 object detection requests/month turns out to roughly $1.52 (1600 MS average lambda duration * 100,000 = 1.17, 1m (3.50) / 10 = .35)

A comparable service on AWS, Rekognition, would be an estimated cost of $100 for 100,000 object detection requests/month. 

This means we can see a 98% decrease in cost for simple object detection analysis.

## Sample responses
![People](./images/people_test.jpg)

```


curl --location --request POST 'https://$api-id.execute-api.$region.amazonaws.com/api/detectObjects' \
--header 'Content-Type: image/jpeg' \
--data-binary '@/some/path/people_test.jpeg'

{
    "Results": [
        {
            "Object": "person",
            "Confidence": 0.8966946005821228,
            "BoundingBoxes": {
                "x": 1231,
                "y": 356,
                "w": 664,
                "h": 681
            }
        },
        {
            "Object": "tie",
            "Confidence": 0.8887098431587219,
            "BoundingBoxes": {
                "x": 1564,
                "y": 745,
                "w": 64,
                "h": 118
            }
        },
        {
            "Object": "person",
            "Confidence": 0.3026312291622162,
            "BoundingBoxes": {
                "x": 127,
                "y": 17,
                "w": 811,
                "h": 1054
            }
        }
    ]
}
```
### Deployment

TBD

