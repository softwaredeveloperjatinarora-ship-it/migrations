export interface TableType {
  id?: string;
  // imgsrc?: string;
  name?: string;
  post?: string;
  pname?: any[];
  teams?: any[];
  status?: string;
  budget?: string;
}

export interface EnTableType {
  id: string;
  // imgsrc: string;
  name: string;
  // post?: string;
  // email: string;
  pname: string;
  // teams: {
  //   id: string;
  //   //color: string;
  //   text: string;
  // }[];
  // status: string;
  // weeks: string;
  budget: string;
  actions?: any;
  dragHandle?: any;
  checkboxes?: any;
}

const basicsTableData: TableType[] = [
  {
    id: "1",
    name: "BH-1",
    pname: [
      {
        id: "1.1",
        text: "01824-444521",
      },
      {
        id: "1.2",
        text: "01824-444522",
      },
      {
        id: "1.3",
        text: "01824-444523",
      },
    ],
    teams: [
      {
        id: "1.1",
        //color: "error.main",
        text: "A",
      },
      {
        id: "1.2",
        //color: "error.main",
        text: "B",
      },
      {
        id: "1.3",
        //color: "error.main",
        text: "c",
      },
    ],
    budget: "9915020442",
  },
  {
    id: "2",
    name: "BH-2",
    pname: [
      {
        id: "1.1",
        text: "	01824-444524",
      },

    ],
    teams: [
      {
        id: "1.1",
        //color: "error.main",
        text: "A,B",
      },
      // {
      //   id: "1.2",
      //   //color: "error.main",
      //   text: "B",
      // },

    ],
    budget: "9888598705",
  },
  {
    id: "3",
    name: "BH-3",
    pname: [
      {
        id: "1.1",
        text: "01824-444526",
      },
      {
        id: "1.2",
        text: "01824-444527",
      },
      // {
      //   id: "1.3",
      //   text: "5465465",
      // },
    ],
    teams: [
      {
        id: "1.1",
        //color: "secondary.main",
        text: "A,B",

      },
      {
        id: "1.2",
        //color: "error.main",
        text: "C,D",
      },
      // {
      //   id: "1.3",
      //   //color: "error.main",
      //   text: "c",
      // },
    ],
    budget: "9915710553",
  },
  {
    id: "4",
    name: "BH-4",
    pname: [
      {
        id: "1.1",
        text: "01824-444529",
      },

    ],
    teams: [
      {
        id: "1.1",
        //color: "secondary.main",
        text: "A,B,C,D",
      },
      // {
      //   id: "1.2",
      //   //color: "error.main",
      //   text: "B",
      // },
      // {
      //   id: "1.3",
      //   //color: "error.main",
      //   text: "c",
      // },
    ],
    budget: "9876015107",
  },
  {
    id: "5",
    name: "BH-5",
    pname: [
      {
        id: "1.1",
        text: "01824-444530",
      },
      {
        id: "1.2",
        text: "01824-444531",
      },


    ],
    teams: [
      {
        id: "1.1",
        //color: "secondary.main",
        text: "A,B",
      },
      {
        id: "1.2",
        //color: "error.main",
        text: "C",
      },

    ],
    budget: "9780036434",
  },
  {
    id: "6",
    name: "BH-6",
    pname: [
      {
        id: "1.1",
        text: "	01824-444532",
      },
      {
        id: "1.2",
        text: "01824-444533",
      },

    ],
    teams: [
      {
        id: "1.1",
        //color: "secondary.main",
        text: "A",
      },
      {
        id: "1.2",
        //color: "error.main",
        text: "B,C",
      },

    ],
    budget: "9501110445",
  },

  {
    id: "7",
    name: "BH-7",
    pname: [
      {
        id: "1.1",
        text: "	01824-444536",
      },


    ],
    teams: [


    ],
    budget: "7508182896",
  },

  {
    id: "8",
    name: "BH-8",
    pname: [
      {
        id: "1.1",
        text: "01824-444528",
      },


    ],
    teams: [


    ],
    budget: "9780005942",
  },

  {
    id: "9",
    name: "Apartment",
    pname: [
      {
        id: "1.1",
        text: "01824-444520",
      },


    ],
    teams: [


    ],
    budget: "9878977900",
  },

  {
    id: "10",
    name: "GH-1",
    pname: [
      {
        id: "1.1",
        text: "	01824-444081",
      },


    ],
    teams: [


    ],
    budget: "9915020443",
  },

  {
    id: "11",
    name: "GH-2",
    pname: [
      {
        id: "1.1",
        text: "	01824-444082	",
      },


    ],
    teams: [


    ],
    budget: "9876644335",
  },

  {
    id: "12",
    name: "GH-3",
    pname: [
      {
        id: "1.1",
        text: "	01824-444083	",
      },


    ],
    teams: [


    ],
    budget: "9876740090",
  },
  {
    id: "13",
    name: "GH-4",
    pname: [
      {
        id: "1.1",
        text: "01824-444084		",
      },


    ],
    teams: [


    ],
    budget: "9915020444",
  },
  {
    id: "14",
    name: "GH-5",
    pname: [
      {
        id: "1.1",
        text: "01824-444303			",
      },


    ],
    teams: [
      {
        id: "1.1",
        //color: "secondary.main",
        text: "A,B",
      },

    ],
    budget: "9876015106",
  },
  {
    id: "15",
    name: "GH-6",
    pname: [
      {
        id: "1.1",
        text: "01824-444301	",
      },


    ],
    teams: [
      {
        id: "1.1",
        //color: "secondary.main",
        text: "A.B",
      },

    ],
    budget: "9915020439",
  },

];

const EnhancedTableData: EnTableType[] = [
  {
    id: "1",
    name: "Hospital Reception",
    pname: "01824-444079, 01824-501227",
   
    budget: "---",
  },
  {
    id: "2",
    name: "Mr. Jagdeep Singh",
    pname: "",
   
    budget: "9780036450",
  },
  {
    id: "3",
    name: "Hospital Male Ward",
    pname: "01824-444066",
   
    budget: "---",
  },
  {
    id: "4",
    name: "Mr. Aneesh George",
    pname: "---",
   
    budget: "7508182840",
  },
  {
    id: "5",
    name: "Hospital Female Ward",
    pname: "01824-444067",
   
    budget: "---",
  },
  {
    id: "6",
    name: "Ms. Karamjit",
    pname: "",
   
    budget: "9780036453",
  },
  {
    id: "7",
    name: "Medical Laboratory",
    pname: "01824-444069",
   
    budget: "---",
  },
  {
    id: "8",
    name: "Dr. N. K. Gupta",
    pname: "01824-444071",
   
    budget: "9878426871",
  },
  {
    id: "9",
    name: "Dr. Vijay Mohan Soni",
    pname: "01824-444074",
   
    budget: "9878426880",
  },

];





const  WomenHelpCenter: EnTableType[] =[
  {
    id: "1",
    name: "Dr. Monica Gulati		",
    pname: "01824-444040",
   
    budget: "9915020408",
  },
  {
    id: "2",
    name: "Mrs. Ravinder Kaur	",
    pname: "	01824-444235",
   
    budget: "9878977800",
  },
  {
    id: "3",
    name: "Ms. Nirpaljeet Kaur	",
    pname: "---",
   
    budget: "7986757060",
  },
  {
    id: "4",
    name: "Mr. Surinder Khurana		",
    pname: "01824-444097",
   
    budget: "9876644331",
  },

]



const  FireAndSafety : EnTableType[] =[
  {
    id: "1",
    name: "Office of Fire & Safety Cell	",
    pname: "01824-444201",
   
    budget: "---",
  },
  {
    id: "2",
    name: "Mr. Kuldeep Singh Minhas ( Fire Officer )		",
    pname: "---",
   
    budget: "9780036402",
  },
  {
    id: "3",
    name: "Fire Tender		",
    pname: "---",
   
    budget: "7508183870",
  },
  {
    id: "4",
    name: "Mr. Surinder Kumar Khurana		",
    pname: "01824-444097",
   
    budget: "9876644331",
  },
  {
    id: "5",
    name: "Mr. Sunil Sharma	",
    pname: "01824-444661",
   
    budget: "9878426874",
  },
  {
    id: "6",
    name: "Brig. G. S. Dhillon		",
    pname: "01824-444200",
   
    budget: "9780005945",
  },
]




export { basicsTableData, EnhancedTableData,WomenHelpCenter,FireAndSafety };
