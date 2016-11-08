interface AmpedRESTInterface{
  success : boolean;
  message : string;
  meta    : Object;
  response: any;
}

export class AmpedService {
  
  ampedService(request : any ){
    return request
      .toPromise()
      .then((res : any) => res.json())
      .then((res : AmpedRESTInterface) => {
        console.log(res);
        if ( res.success )
          return res.response;
        else
          throw res.message;
      })
      .catch( (err : any) => console.log(err));
  }
  
}
