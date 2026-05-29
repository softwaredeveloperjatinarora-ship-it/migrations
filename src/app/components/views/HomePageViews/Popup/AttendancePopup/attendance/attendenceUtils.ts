
type course={
  "RegistrationNumber":string,
  "Name": string,
  "BatchYear": number,
  "ProgramName": string,
  "RollNumber": string,
  "CourseCode": string,
  "CourseName": string,
  "Last_Date": string,
  "Grade": string,
  "Total_Delv": number,
  "Total_Attd": number,
  "Total_Perc": number,
  "DutyLeave": number,
  "Total": number
}

const convertAttendenceData=(raw:course[])=>{
// console.log("raw",raw)
    const percentageArray: number[] = [];
  const colorArray: string[] = [];
  const courseCodeArr: string[] = [];
  const dutyLeaveArr: number[] = [];
  const CourseName:string[]=[];
  const totalPersent:number=raw[0]?.Total;
  const classData:{totalDeliverd:number,totalAttend:number}[]=[]; //array of  object
    raw.forEach((item:course) => {
       // let a = (((item.DutyLeave + item.totalAttend) / item.totalClass) * 100) we have already percentage
        percentageArray.push(item.Total_Perc);
        colorArray.push(item.Total_Perc==0?'transparent':item.Total_Perc > 95 ? '#1f4a8f' : item.Total_Perc > 50 ? '#545ea1' : '#de5465')
        courseCodeArr.push(item.CourseCode);
        dutyLeaveArr.push(item.DutyLeave);
        CourseName.push(item.CourseName);
        classData.push({totalDeliverd:item.Total_Delv,totalAttend:item.Total_Attd})

        
      })
      return {percentageArray:percentageArray,colorArray:colorArray,courseCodeArr:courseCodeArr,dutyLeaveArr:dutyLeaveArr,totalPresent:totalPersent,CourseName:CourseName,classData}
}

export const designPageLayout=(data:any)=>
{
  const courseData=data.attendenceDetail
  const classData=data.allCourse;
  let tableData=``;
  let eachSubData=``;
  

  courseData.forEach((eachCourse: any) => {
    
    const filterData=classData.filter((CourseName:any)=>CourseName.Coursecode===eachCourse.CourseCode)
    eachSubData=filterData.map((a:any)=>`<tr><td>${ new Date(a.AttendanceDate).toLocaleDateString('en-GB', { day: '2-digit', month:'2-digit', year: 'numeric' })}</td>
                              <td>${a.AttendanceTime}</td>
                              <td>${a.AttendanceType}</td>
                              <td>${a.Name}</td>
                              <td>${a.AttendanceCode}</td>
                              <td>${a.DutyLeave===""?"-":a.DutyLeave}</td>
                              <td>${a.BlockReason}</td>
                              </tr>`).join('');
   
   
   tableData+=`<table style="margin-top:20px"><tr ><th  colspan="7" style="text-align: center;background-color:orange"> ${eachCourse.CourseCode}</th></tr><tr >
                  <th >Date</th>
                  <th >Time</th>
                  <th >Mode</th>
                  <th >Faculty</th>
                  <th >Attendence</th>
                  <th >DL</th>
                  <th >Block Reason</th>
                  </tr>${eachSubData}</table>`;
  });
// console.log(tableData)
  return (
      
        tableData
     
  );
}
export default convertAttendenceData;