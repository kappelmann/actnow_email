PREFIX=meps
SITES_FOLDER=./websites/${PREFIX}/
DATABASE_FOLDER=./databases/${PREFIX}/
DATABASE_VERSION="$(date -I)"
DATABASE="${DATABASE_FOLDER}${PREFIX}_${DATABASE_VERSION}.db"
DATABASE_CONFIG="${DATABASE_FOLDER}/${PREFIX}_config.json"

cd "./meps_contact_backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
cd "../"
mkdir -p ${SITES_FOLDER}
actnow-scrape download --output-dir ${SITES_FOLDER} --force
mkdir -p ${DATABASE_FOLDER}
actnow-scrape initdb -i ${SITES_FOLDER} -o ${DATABASE}
echo "{\"version\": \"${DATABASE_VERSION}\"}" > ${DATABASE_CONFIG}
