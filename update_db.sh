PREFIX=meps
BACKEND_PY=./meps_contact_backend/query.py
SITES_FOLDER=./websites/${PREFIX}/
DATABASE_FOLDER=./databases/${PREFIX}/
DATABASE_VERSION="$(date -I)"
DATABASE="${DATABASE_FOLDER}${PREFIX}_${DATABASE_VERSION}.db"
DATABASE_CONFIG="${DATABASE_FOLDER}/${PREFIX}_config.json"

mkdir -p ${SITES_FOLDER}
${BACKEND_PY} download --output_dir ${SITES_FOLDER} --force
mkdir -p ${DATABASE_FOLDER}
${BACKEND_PY} initdb -i ${SITES_FOLDER} -o ${DATABASE}
echo "{\"version\": \"${DATABASE_VERSION}\"}" > ${DATABASE_CONFIG}
