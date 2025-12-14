#!/bin/bash

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --from=*)
      FROM="${1#*=}"
      shift
      ;;
    --to=*)
      TO="${1#*=}"
      shift
      ;;
    --env=*)
      ENV="${1#*=}"
      shift
      ;;
    *)
      CMD="$CMD $1"
      shift
      ;;
  esac
done

# Function to run Liquibase status/update
run_liquibase() {
  ENV=$1
  CMD=$2
  FROM=$3
  TO=$4

  # Check that either ENV is set or both FROM and TO are set
  if [[ -z "$ENV" && ( -z "$FROM" || -z "$TO" ) ]]; then
    echo "Error: Either ENV must be set, or both FROM and TO must be set"
    exit 1
  fi

  # Check that if TYPE is set, ENV must also be set
  if [[ -n "$TYPE" && -z "$ENV" ]]; then
    echo "Error: If TYPE is set, ENV must also be set"
    exit 1
  fi

  if [[ -n "$ENV" ]]; then
    echo "Running liquibase ($CMD) on SQL-${ENV#*-}"
    liquibase --defaultsFile=packages/database/configs/${ENV#*-}.properties ${CMD} $6
  else
    echo "Running liquibase ($CMD) from $FROM to $TO on SQL"
    liquibase --defaultsFile=packages/database/configs/${FROM}-to-${TO}.properties ${CMD} $6
  fi

}

# Call run_liquibase function with environment, command, and type
run_liquibase "$ENV" "$CMD" "$FROM" "$TO" "$@"
