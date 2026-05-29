interface Packet {
    id: number;
    Sno: number;
    Pktname: string;
    From: string;
    To: string;
    Count: string;
    Type: string;
    Status: number; // Added status field
  }

  export default Packet;

  