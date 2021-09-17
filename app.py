import cv2
import os
import numpy as np
import boto3
import base64
import json
from chalice import Chalice

app = Chalice(app_name='detection_api')

# Only support jpegs and pngs
supported_content_types = ['image/png', 'image/jpeg']

# Minimum confidence for our detection

min_confidence = 0.2

# Threshold for applying non-maxima suppression to bounding boxes

threshold = 0.1

# S3 Client
s3 = boto3.client('s3', region_name='us-west-2')

# Paths to weights, model configuration, and labels the model was trained on
labels_path = './chalicelib/coco.names'
weights_path = './chalicelib/yolov3-tiny.weights'
config_path = './chalicelib/yolov3-tiny.cfg'

# Load labels
labels = open(labels_path, 'r').read().strip().split("\n")


# Generate some colors for each class of label
# Uncomment this code for lab 2:
np.random.seed(42)
label_colors = np.random.randint(0, 255, size=(len(labels), 3),
                                 dtype="uint8")


@app.route('/')
def index():
    return {'hello': 'world'}


@app.route('/detectObjects', methods=['POST'], content_types=supported_content_types, cors=True)
def detect_objects():
    query_params = app.current_request.query_params
    return_image = False

    # Uncomment this code below: 
    # if not query_params:
    #     return_image = False
    # else:
    #    
    #     try:
    #         if 'returnImage' in query_params:
    #             if query_params['returnImage'] == 'true':
    #                 return_image = True
    #         else:
    #             return {"Error": "Unsupported query param in request"}
    #     except:
    #         return {"Error": "Unsupported query param in request"}
    
    raw_image_data = app.current_request.raw_body

    # Load raw image into numpy array
    img_nparr = np.frombuffer(raw_image_data, np.uint8)

    # Load image with cv2 and get dimensions
    image = cv2.imdecode(img_nparr, cv2.IMREAD_COLOR)
    print(image)
    (H, W) = image.shape[:2]

    # Initialize our YOLO neural net
    net = cv2.dnn.readNetFromDarknet(config_path, weights_path)

    # Determine only the *output* layer names that we need from YOLO
    ln = net.getLayerNames()
    ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    # Preprocess image by constructing a normalized blob, then perform a forward
    # pass of the YOLO neural net, giving us bounding boxes and probabilities
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416),
                                 swapRB=True, crop=False)
    net.setInput(blob)
    layer_outputs = net.forward(ln)

    # Intialize empty lists to hold our bounding boxes, confidence scores, class ids
    boxes = []
    confidences = []
    class_ids = []

    # Loop over each output layer
    for output in layer_outputs:
        # Loop over each detection
        for detection in output:
            # Extract the class ID and confidence (i.e., probability) of
            # the current object detection
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            # Filter out detections that our below our min confidence threshold
            if confidence > min_confidence:
                # scale the bounding box coordinates back relative to the
                # size of the image, keeping in mind that YOLO actually
                # returns the center (x, y)-coordinates of the bounding
                # box followed by the boxes' width and height
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")

                # use the center (x, y)-coordinates to derive the top and
                # and left corner of the bounding box
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))

                # update our list of bounding box coordinates, confidences,
                # and class IDs
                boxes.append([x, y, int(width), int(height)])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    # TODO: Add check to see if we actually got detections

    # Apply non-maxima suppression to suppress weak and overlapping bounding
    # boxes
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, min_confidence, threshold)

    # Make sure we have at least one detection
    if len(indexes) > 0:
        print('looping over indexes')
        results = []
        # Loop over the indexes we are keeping
        for i in indexes.flatten():

            # Extract the bounding box coordinates
            x, y = (boxes[i][0], boxes[i][1])
            w, h = (boxes[i][2], boxes[i][3])

            result = {"Object": labels[class_ids[i]], "Confidence": confidences[i], "BoundingBoxes": {
                "x": x, "y": y, "w": w, "h": h}}
            results.append(result)

        if return_image is True:
            # Comment this code below out  for lab 3:
            return {"Results": "Not implemented"}


            # Draw a bounding boxes and label text on image
            
            # Uncomment this code below:
            # color = [int(c) for c in label_colors[class_ids[i]]]
            # cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
            # text = "{}: {:.4f}".format(labels[class_ids[i]], confidences[i])
            # cv2.putText(image, text, (x, y - 5),
            #             cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            # encoded_image = base64.b64encode(
            #     cv2.imencode('.jpg', image)[1]).decode()
            # response = {"image": encoded_image}

            # json_respone = json.dumps(
            #     response, ensure_ascii=False, indent=4)
            #return json_respone

        else:
            return {"Results": results}
    else:
        return {"Results": "None"}
