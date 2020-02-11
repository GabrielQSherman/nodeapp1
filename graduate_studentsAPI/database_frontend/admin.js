
    //event listeners

    document.getElementById('subPostBtn').addEventListener('click', postRequest);
    
    document.getElementById('submitUpdate').addEventListener('click', (putRequest));

    document.getElementById('submitDelete').addEventListener('click', (deleteRequest));


    //fetch request function

    async function postRequest() {

        let postForm = document.getElementById('postForm'),

            postFormData = create_obj_with_formdata(postForm);

            postJson = JSON.stringify(postFormData);

        document.getElementById('request_message').innerText = 'Summiting';

        try {

            await fetch('http://localhost:3000/admin/', {

                method: 'POST',

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },

                body: postJson
            })

            //after the fetch POST request goes to the server through the api and back to the client a promise is returned
            //the resonse will be in a readable stream format(not good for extracting data)
            //but it will have a status code that will be useful for error handling
            .then((response) => {
                console.log(response.status);

                if (response.status != 200) { //if a status other than 'OK' is receivedS

                    console.log(response.json());
                    
                    throw new Error(`The students post failed Status: ${response.status}`)
                    
                }
                
                return response.json()
            })


            //after the response is parsed to json its properties can be used in the DOM and a success message is sent to the client
            .then((json) => {
                console.log(json.newpost);

                document.getElementById('responseElm').innerHTML = `New Student Added to Database<br>Student's Name: ${json.newpost.firstName} ${json.newpost.lastName}<br>Document DB Id: ${json.newpost._id}`;

                document.getElementById('request_message').innerText = 'Student Successfully Posted';

                clear_formData(postForm) //sets all the input values to blank
                
            })
        
        } catch (err) {

            document.getElementById('responseElm').innerText = err;

            document.getElementById('request_message').innerText = 'Student Info Could Not Be Posted';
            
        }
        
    }
    

    function putRequest() {

          let putForm = document.getElementById('putForm'),

              docId,
    
              putFormDataObj = create_obj_with_formdata(putForm),

              putJson = JSON.stringify(putFormDataObj);

        (async () => {

            const Update = await fetch('http://localhost:3000/admin/put/' + docId, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },

              body: putJson

            });
            
            const UpdateResponse = await Update.json();
          
            console.log(UpdateResponse);

        })();


        console.log('test');
        
    }

    //DELETE REQUEST FOR A SPECIFIC POST (ID)
    function deleteRequest() {

        try {

            document.getElementById('request_message').innerText = 'Sending Delete Request'

            let id = delete_id.value;

            console.log(id);
            

            fetch('http://localhost:3000/admin/delete/' + id, {

                method: 'DELETE'

            })
            
            .then(response => {

                return response.json();

            })

            .then(response => {

                console.log(response.status, response.message);

                document.getElementById('request_message').innerText = 'Completed Deletion Request';


                if (response.status == 200) {

                    delete_id.value = '';
                    
                    delete_id.placeholder = 'Deletion Success';

                    document.getElementById('responseElm').innerText = response.message;

                    
                } else {

                    document.getElementById('responseElm').innerText = response.message;

                }
            })

            
        } catch (err) {

            console.log(err);
            
        }
        
   }



   function clear_formData(formElement) {
       
        for (const key of formElement) {
            key.value = ''
        }

   }

   function create_obj_with_formdata(rawFormData) {

        let newObj = {};

        for (const key of rawFormData) {

            if (key.name == 'docid' && key.value != '') {
                // console.log('Document Id', key.value);
                
                docId = key.value
                
            } else if (key.value != '') {

                // console.log('appending', key.name, key.value);
            
                newObj[key.name] = key.value;

            }
            
        }

        return newObj
       
   }