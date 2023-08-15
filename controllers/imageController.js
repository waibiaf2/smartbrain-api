const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
//const USER_ID = 'zx59ox3pamtc';//(the code by your name)
//         const PAT = '27c63126a4304346bb094f7c1ff9c18e


const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 27c63126a4304346bb094f7c1ff9c18e");



const handleApiCall =  (req,res) => {
    const {input} = req.body;

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "face-detection",
            inputs: [{data: {image: {url: `${input}`}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }

            res.json(response);
            console.log(response);
        }
    );
}

const handleImage = (req, res,db) => {
    const {id} = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            // console.log(entries[0]);
            res.json(entries[0]);
        }).catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
    handleImage,
    handleApiCall,
}