# Rambl

An online community for improving job interview skills. Users can practice job interviews with one another using ramdomly presented common interview questions.

Rambl uses the WebRTC API, which is currently implemented in Chrome, Firefox and Opera.

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Contributing](#contributing)
1. [License](#license)

## Usage

Login to your rambl instance. Signup for an account if you need to. Once you are logged in, you can join an available room or create a room. Invite someone in to participate.

One of you assume the role of the interviewer and one will assume the role of the candidate. Once you have deteremined which role you both will be, it is time to start the interview.

The interviewer may choose questions from the list of provided interview questions or may use his or her own questions.

Once you have conducted the interview, provide useful feedback for the other person. Feedback should be about the interview itself and should be objective in nature.

## Requirements

- Node 0.10.x
- Express 4.5.x
- Easy RTC 1.0.11
- Sequelize 1.7.9
- MySQL
- Socket.io 0.9.x

## Development

### Installing Dependencies

From within the project's root directory:

```sh
npm install -g bower
npm install
bower install
```

### Tasks

See the project's backlong in asana.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
