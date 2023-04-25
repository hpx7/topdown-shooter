import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import React from "react";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

import "./rsh-style.css";
import GitHubIcon from "../assets/github.svg";

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("javascript", js);

export function ExplanationText() {
  return (
    <div className={"mt-6 mb-28 p-4 sm:p-0 w-full sm:w-[800px]"}>
      <h1 id={"docsTop"} style={h1Style}>
        Learn how we built Bullet Mania
      </h1>
      <Link href={"https://github.com/hathora/topdown-shooter/"} icon={GitHubIcon}>
        Bullet Mania source code
      </Link>
      <p style={textStyle}>
        We built <strong>Bullet Mania</strong> to showcase how simple it is to build and scale a multiplayer game on{" "}
        <Link href={"https://hathora.dev/docs"}>Hathora Cloud</Link>. Hathora Cloud works well for both new and existing
        multiplayer games. To learn more about deploying your multiplayer game on Hathora Cloud, check out our{" "}
        <Link href={"https://hathora.dev/docs/get-started"}>10-minute Get Started guide</Link>.
      </p>
      <h1 style={h1Style}>What is happening?</h1>
      <p style={textStyle}>
        When a player <NavLink headingId={"createLobby"}>creates a public or private room</NavLink>, a game server is
        dynamically provisioned by Hathora Cloud in the region specified.
      </p>
      <p style={textStyle}>
        <strong>Important notes</strong>
      </p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-disc ml-6"}>
        <li className={"mt-2"}>
          A player must be authenticated to create/provision rooms so Hathora can enforce rate limiting
        </li>
        <li className={"mt-2"}>
          Bullet Mania's servers are automatically scalable because Hathora provisions as many rooms as needed
        </li>
        <li className={"mt-2"}>Once your game server exits or is idle for 5 minutes, the compute resource goes away</li>
        <li className={"mt-2"}>Hathora has no fixed costs, pricing is based on active compute usage</li>
      </ul>
      <p style={textStyle} className="italic text-neutralgray-400">
        To learn more about key concepts in Hathora, check out our docs on{" "}
        <Link href={"https://hathora.dev/docs/concepts/hathora-entities"}>Hathora Entities</Link> and{" "}
        <Link href={"https://hathora.dev/docs/concepts/room-lifecycle"}>Room Lifecycle</Link>.
      </p>
      <h1 style={h1Style}>Why is it good?</h1>
      <p style={textStyle}>As seen in Bullet Mania your players will get good ping times because Hathora has:</p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-decimal ml-6"}>
        <li className={"mt-1"}>
          <strong>multi-region server availability</strong> to get players a server closest to them
        </li>
        <li className={"mt-1"}>
          <strong>private edge network</strong> that avoids network congestion and ensures an optimal path to the server
        </li>
      </ul>
      <p style={textStyle}>
        You get improved performance while reducing operational complexity because you don’t have to worry about:
      </p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-decimal ml-6"}>
        <li className={"mt-1"}>Patching underlying hosts for security</li>
        <li className={"mt-1"}>Capacity planning in each region you want game servers available</li>
        <li className={"mt-1"}>Paying for idle capacity to manage demand spikes</li>
      </ul>
      <h1 style={h1Style}>How to use Hathora for your game?</h1>
      <p style={textStyle}>
        You’ll need some middleware that can request capacity on Hathora and share the connection information with the
        right players. If you don’t have an existing Lobby/Matchmaking service, Hathora offers a{" "}
        <Link href={"https://api.hathora.dev/ui/#/LobbyV2"}>lightweight Lobby Service</Link> to spin up and route
        players to the correct room.
      </p>
      <p style={textStyle}>
        For Bullet Mania, we created a wrapper around{" "}
        <Link href={"https://github.com/hathora/hathora-cloud-sdks/tree/main/typescript"}>Hathora's Cloud SDK</Link> to
        centralize all of our code that directly integrate with Hathora's APIs. You can view the code here: {"  "}
        <Link href={"https://github.com/hathora/topdown-shooter/tree/develop/common/lobby-service"} icon={GitHubIcon}>
          Bullet Mania's API wrapper
        </Link>
        .
      </p>
      <p style={textStyle}>With our Lobby Service, integration just takes a few steps:</p>
      <ul className={"font-hathoraBody list-decimal ml-6"}>
        <li className={"mt-1 text-neutralgray-400 hover:text-neutralgray-200 font-semibold"}>
          <NavLink className={"text-hathoraBrand-50"} headingId={"authenticatePlayers"}>
            Authenticate players
          </NavLink>
        </li>
        <li className={"mt-1 text-neutralgray-400 hover:text-neutralgray-200 font-semibold"}>
          <NavLink headingId={"createLobby"}>Create public or private lobbies</NavLink>
        </li>
        <li className={"mt-1 text-neutralgray-400 hover:text-neutralgray-200 font-semibold"}>
          <NavLink headingId={"listPublicLobbies"}>Fetch all public lobbies</NavLink>
        </li>
        <li className={"mt-1 text-neutralgray-400 hover:text-neutralgray-200 font-semibold"}>
          <NavLink headingId={"connectToLobby"}>Connect to a public or private lobby</NavLink>
        </li>
        <li className={"mt-1 text-neutralgray-400 hover:text-neutralgray-200 font-semibold"}>
          <NavLink headingId={"setLobbyState"}>Update lobby state on game server</NavLink>
        </li>
      </ul>
      <div className={"flex justify-center"}>
        <p className={"text-neutralgray-500 mt-6 mb-1 ml-1 font-hathoraBody"}>
          Click on the buttons below to see how each part has been implemented
        </p>
      </div>
      <div className={"relative"}>
        <img src={"/screenshots/lobby.png"} className={"opacity-50"} />
        <NavButton headingId={"listPublicLobbies"} className={"group top-[174px] left-[18px]"}>
          List Public Lobbies{" "}
          <ArrowLongRightIcon className="ml-0.5 h-5 w-5 text-hathoraBrand-500 group-hover:text-neutralgray-700 stroke-2" />
        </NavButton>
        <NavButton headingId={"lobbyInfo"} className={"group top-[246px] left-[252px]"}>
          Get Lobby Info{" "}
          <ArrowLongRightIcon className="ml-0.5 h-5 w-5 text-hathoraBrand-500 group-hover:text-neutralgray-700 stroke-2" />
        </NavButton>
        <NavButton headingId={"createLobby"} className={"group top-[396px] right-[180px]"}>
          Create Lobby{" "}
          <ArrowLongRightIcon className="ml-0.5 h-5 w-5 text-hathoraBrand-500 group-hover:text-neutralgray-700 stroke-2" />
        </NavButton>
        <NavButton headingId={"connectionInfo"} className={"group top-[500px] right-[240px]"}>
          Get Connection Info{" "}
          <ArrowLongRightIcon className="ml-0.5 h-5 w-5 text-hathoraBrand-500 group-hover:text-neutralgray-700 stroke-2" />
        </NavButton>
      </div>
      <h1 id={"authenticatePlayers"} style={h1Style}>
        Authenticate Players
      </h1>
      <p style={textStyle}>Use Hathora’s Auth Client to generate a unique token for players using Google login.</p>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Import auth client from <Code>@hathora/hathora-cloud-sdk</Code>
      </p>
      <CodeBlock>
        {`import {AuthV1Api, Configuration} from "@hathora/hathora-cloud-sdk";

let authClient = new AuthV1Api(new Configuration());`}
      </CodeBlock>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Use auth client to generate player tokens (needed to create rooms)
      </p>
      <CodeBlock>
        {`// arbitrary token & id
let { token } = await authClient.loginAnonymous(appId);

// integrate with Google
let { token } = await authClient.loginGoogle(appId, googleIdToken);

// players can enter names
let { token } = await authClient.loginNickname(appId,{nickname:"name"});`}
      </CodeBlock>
      <p style={textStyle}>
        See how we authenticate players in Bullet Mania: {"  "}
        <Link
          href={"https://github.com/hathora/topdown-shooter/blob/develop/client/src/app.tsx#L162"}
          icon={GitHubIcon}
        >
          Bullet Mania authentication
        </Link>
      </p>
      <h1 id={"createLobby"} style={h1Style}>
        Create public and private lobbies
      </h1>
      <p style={textStyle}>There are 3 types of lobbies that a player can create:</p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-decimal ml-6"}>
        <li className={"mt-1"}>
          <strong>Public</strong>: it will be returned the roomId in the public lobby list and any player can join
        </li>
        <li className={"mt-1"}>
          <strong>Private</strong>: the player who created the game must share the roomId with their friends
        </li>
        <li className={"mt-1"}>
          <strong>Local</strong>: for testing with a server running locally
        </li>
      </ul>
      <p style={textStyle}>
        If you have any specific user input you need to take in to initial your game state then pass it in through the{" "}
        <Code>initialConfig</Code> object. In Bullet Mania, for example, <Code>initialConfig</Code> includes:
      </p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-disc ml-6"}>
        <li className={"mt-1"}>
          <Code>capacity</Code>: Max players for a room
        </li>
        <li className={"mt-1"}>
          <Code>winningScore</Code>: Number of kills to win
        </li>
      </ul>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Import Lobby client from <Code>@hathora/hathora-cloud-sdk</Code>
      </p>
      <CodeBlock>
        {`import {
  Configuration,
  LobbyV2Api,
} from "@hathora/hathora-cloud-sdk";

let lobbyClient = new LobbyV2Api(new Configuration());`}
      </CodeBlock>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Authenticated players (via client) can create lobbies
      </p>
      <CodeBlock>{`const lobby = await lobbyClient.createLobby(
  appId, // your Hathora application id
  token, // signed player token (see "Authenticate Players" section)
  {
    visibility: "public", // options: ["public", "private", "local"]
    region: "Seattle",
    // custom object that your server code gets access to immediately
    initialConfig: {capacity: 4, winningScore: 10},
  },
  roomId // (optional) use to set custom roomIds
)`}</CodeBlock>
      <p style={textStyle}>
        See how we create lobbies in Bullet Mania: {"  "}
        <Link
          href={"https://github.com/hathora/topdown-shooter/blob/develop/client/src/components/GameCreator.tsx#L98"}
          icon={GitHubIcon}
        >
          Bullet Mania lobby creation (client)
        </Link>
      </p>
      <p style={textStyle}>
        See how the server consumes <Code>initialConfig</Code>: {"  "}
        <Link
          href={"https://github.com/hathora/topdown-shooter/blob/develop/server/server.ts#L155-L168"}
          icon={GitHubIcon}
        >
          Bullet Mania player joins (server)
        </Link>
      </p>
      <h1 id={"listPublicLobbies"} style={h1Style}>
        Fetch all public lobbies
      </h1>
      <p style={textStyle}>
        It's easy to retrieve a list of all public lobbies and you can optionally pass a <Code>Region</Code> to filter
        by.
      </p>
      <p style={textStyle}>
        In Bullet Mania, we kept it simple and display all lobbies (newest at the top) and make it easy for layers to
        join. For more advanced usage, you can set custom properties via <Code>lobbyState</Code> and use those
        properties for custom client-side filtering and custom matchmaking logic. For more details on using{" "}
        <Code>lobbyState</Code>, see <NavLink headingId={"setLobbyState"}>Update lobby state on game server</NavLink>.
      </p>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>Display all active public rooms</p>
      <CodeBlock>{`import {
  Configuration,
  LobbyV2Api,
} from "@hathora/hathora-cloud-sdk";

let lobbyClient = new LobbyV2Api(new Configuration());

const publicLobbies = lobbyClient.listActivePublicLobbies(
  appId, // your Hathora application id
  "Seattle", // (optional) region filter
);`}</CodeBlock>
      <p style={textStyle}>
        See how we list lobbies for Bullet Mania: {"  "}
        <Link
          href={
            "https://github.com/hathora/topdown-shooter/blob/develop/client/src/components/PublicLobbyList.tsx#L142"
          }
          icon={GitHubIcon}
        >
          Bullet Mania public lobbies list
        </Link>
      </p>
      <h1 id={"connectToLobby"} style={h1Style}>
        Connect to a public or private lobby
      </h1>
      <p style={textStyle}>
        When a player wants to join a room, you can use the <Code>roomId</Code> to get connection details (host and
        port) to connect your player to the correct server.
      </p>
      <p style={textStyle}>
        In many cases, you game may need to run some custom logic before letting a player connect. You can use{" "}
        <Code>lobbyState</Code> to store relevant data needed for this custom logic.
      </p>
      <p style={textStyle}>
        Once you've gotten your connection details, you can use the network transport of your choice to connect. Some
        popular options include Socket.io, built-in game engine tooling, and custom solutions. In Bullet Mania, we use
        Hathora's open-source network transport from:{" "}
        <Link href={"https://github.com/hathora/buildkits/tree/main/typescript-client-sdk"} icon={GitHubIcon}>
          hathora/buildkits
        </Link>
      </p>
      <h2 id={"joinLobby"} style={h2Style}>
        Join a room
      </h2>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Import Room and Lobby clients from <Code>@hathora/hathora-cloud-sdk</Code>
      </p>
      <CodeBlock>
        {`import {
  Configuration,
  LobbyV2Api,
  RoomV1Api,
} from "@hathora/hathora-cloud-sdk";

let lobbyClient = new LobbyV2Api(new Configuration());
let roomClient = new RoomV1Api(new Configuration());`}
      </CodeBlock>
      <p id={"lobbyInfo"} className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Fetch lobby information, see{" "}
        <Link href={"https://api.hathora.dev/ui/#/LobbyV2/GetLobbyInfo"}>return values for getLobbyInfo()</Link>
      </p>
      <CodeBlock>{`// This step is only needed if you want to validate lobbyState before connecting a player
const lobbyInfo = lobbyClient.getLobbyInfo(
  appId, // your Hathora application id
  roomId,
);
// lobbyInfo will contain details like lobbyState and initialConfig`}</CodeBlock>
      <p id={"connectionInfo"} className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>
        Get connection info (host and port) to route your player
      </p>
      <CodeBlock>{`const connectionInfo = roomClient.getConnectionInfo(
  appId, // your Hathora application id
  roomId,
);

// Use your network transport of choice (using hathora/buildkits here)
import { HathoraConnection } from "@hathora/client-sdk";
const connection = new HathoraConnection(roomId, connectionInfo);`}</CodeBlock>
      <p style={textStyle}>See how we implemented it for Bullet Mania:</p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-disc ml-6"}>
        <li className={"mt-2"}>
          <Link
            href={"https://github.com/hathora/topdown-shooter/blob/develop/client/src/app.tsx#L41-L71"}
            icon={GitHubIcon}
          >
            Connecting to a room (client)
          </Link>
        </li>
        <li className={"mt-0"}>
          <Link
            href={"https://github.com/hathora/topdown-shooter/blob/develop/server/server.ts#L155-L168"}
            icon={GitHubIcon}
          >
            Checking player capacity (server)
          </Link>
        </li>
      </ul>
      <h1 id={"setLobbyState"} style={h1Style}>
        Update lobby state on game server
      </h1>
      <p style={textStyle}>
        <Code>lobbyState</Code> is flexible object that is set in by your server code, but is easily accessed in your
        client code. It can be thought of as a custom blob that is persisted outside of your server.
      </p>
      <p style={textStyle}>
        Some example use cases for <Code>lobbyState</Code>:
      </p>
      <ul className={"font-hathoraBody text-neutralgray-200 list-disc ml-6"}>
        <li className={"mt-1"}>player count (to enforce play capacity)</li>
        <li className={"mt-1"}>persist end game data (like winning player and final scores)</li>
        <li className={"mt-1"}>custom filtering for available lobbies</li>
      </ul>
      <p className={"text-neutralgray-400 mt-4 mb-2 ml-1 font-hathoraBody"}>Update lobbyState</p>
      <CodeBlock>{`import {
  Configuration,
  LobbyV2Api,
} from "@hathora/hathora-cloud-sdk";

let lobbyClient = new LobbyV2Api(new Configuration({ basePath: "api.hathora.dev" }));

// lobbyState is meant to hold custom objects
let myCustomLobbyState = { isGameEnd: true,  winningPlayerId: myGameData.winningPlayerId,}
const lobby = await lobbyClient.setLobbyState(
  appId,
  roomId,
  { state: myCustomLobbyState },
  // \`appToken\` is the auth token for your Hathora Cloud account
  //  (different than the tokens for your players)
  { headers: { Authorization: \`Bearer \${appToken}\`, "Content-Type": "application/json" } }
);`}</CodeBlock>
      <p style={textStyle}>
        See how Bullet Mania uses <Code>lobbyState</Code>: {"  "}
        <Link href={"https://github.com/hathora/topdown-shooter/blob/develop/server/server.ts#L481"} icon={GitHubIcon}>
          Bullet Mania public lobbies list
        </Link>
      </p>
    </div>
  );
}

/*
 * Component used for short code snippet
 */
function Code(props: { children: React.ReactNode; className?: string }) {
  return (
    <code className={`bg-neutralgray-550 text-hathoraBrand-400 text-sm p-0.5 mt-2 rounded ${props.className}`}>
      {props.children}
    </code>
  );
}

/*
 * Component used for code block
 */
function CodeBlock(props: { children: string | string[]; className?: string }) {
  return (
    <div className="container max-w-[800px] overflow-auto text-sm">
      <SyntaxHighlighter language="javascript" className={"syntax-highlighter"} useInlineStyles={false}>
        {props.children}
      </SyntaxHighlighter>
    </div>
  );
}

/*
 * Component used for external links
 */
function Link(props: { children: React.ReactNode; href: string; className?: string; icon?: string }) {
  return (
    <a
      className={`font-hathoraBody text-hathoraBrand-500 hover:underline ${
        props.icon ? "inline-flex items-center rounded -ml-2 px-2 py-1 hover:bg-neutralgray-650" : "inline-block"
      } ${props.className}`}
      href={props.href}
      target={"_blank"}
    >
      {props.children}
      {props.icon && <img src={props.icon} className={"h4 w-4 ml-1"} />}
    </a>
  );
}

/*
 * Component used to link text to scroll to a specific section
 */
export function NavLink(props: { children: React.ReactNode; headingId: string; className?: string }) {
  return (
    <a
      href={`#${props.headingId}`}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(`#${props.headingId}`)?.scrollIntoView({
          behavior: "smooth",
        });
      }}
      className={`font-hathoraBody text-hathoraBrand-500 hover:underline  ${props.className}`}
    >
      {props.children}
    </a>
  );
}

/*
 * Component used to render buttons over screenshot and scroll to specific sections
 */
function NavButton(props: { children: React.ReactNode; headingId: string; className?: string }) {
  return (
    <a
      href={`#${props.headingId}`}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(`#${props.headingId}`)?.scrollIntoView({
          behavior: "smooth",
        });
      }}
      className={`absolute w-[160px] py-2 rounded bg-neutralgray-700 transition duration-400 group hover:bg-hathoraBrand-500 hover:text-neutralgray-700 font-semibold flex items-center justify-center font-hathora text-xs text-hathoraBrand-500 ${props.className}`}
    >
      {props.children}
    </a>
  );
}

const h1Style = {
  fontFamily: "Space Grotesk",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "32px",
  lineHeight: "40px",
  color: "#AF64EE",
  marginBottom: "12px",
  marginTop: "28px",
};

const h2Style = {
  fontFamily: "Space Grotesk",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "22px",
  lineHeight: "28px",
  color: "#AF64EE",
  marginBottom: "10px",
  marginTop: "20px",
};

const textStyle = {
  marginTop: "16px",
  fontFamily: "Lato",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#d4d4e3",
};
