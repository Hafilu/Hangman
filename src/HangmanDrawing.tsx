const HEAD = (
  <div
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "100%",
      border: "10px solid black",
      position: "absolute",
      top: "48px",
      right: "-25px",
    }}
  />
);

const BODY = (
  <div
    style={{
      width: "10px",
      height: "90px",
      background: "black",
      position: "absolute",
      top: "100px",
      right: 0,
    }}
  />
);

const RIGHT_ARM = (
  <div
    style={{
      width: "70px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "120px",
      right: "-60px",
      rotate: "50deg",
      transformOrigin: "left bottom",
    }}
  />
);

const LEFT_ARM = (
  <div
    style={{
      width: "70px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "120px",
      right: "0px",
      rotate: "-50deg",
      transformOrigin: "right bottom",
    }}
  />
);

const RIGHT_LEG = (
  <div
    style={{
      width: "70px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "175px",
      right: "-60px",
      rotate: "60deg",
      transformOrigin: "left bottom",
    }}
  />
);

const LEFT_LEG = (
  <div
    style={{
      width: "70px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "175px",
      right: 0,
      rotate: "-60deg",
      transformOrigin: "right bottom",
    }}
  />
);
const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

type Props = {
  numberOfGuesses: number;
  swing:boolean;
  winner:boolean
};
import "./Anime.css"
export function HangmanDrawing({ numberOfGuesses,swing ,winner}: Props) {
  return (
    <div style={{ position: "relative" ,marginTop:"20px", marginRight:"35px"}}>
     {!winner && <div className={`${swing ? "t-shape":""}`}>
         {BODY_PARTS.slice(0, numberOfGuesses)}
      </div>
     }
      <div
        style={{
          height: "50px",
          width: "10px",
          background: "black",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />
      <div
        style={{
          height: "10px",
          width: "150px",
          background: "black",
          marginLeft: "70px",
        }}
      />
      <div
        style={{
          height: "350px",
          width: "10px",
          background: "black",
          marginLeft: "70px",
        }}
      />
      <div style={{ height: "10px", width: "150px", background: "black" }} />
    </div>
  );
}
