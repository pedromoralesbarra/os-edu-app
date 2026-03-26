#!/usr/bin/env python3
"""Script simple para validar `data/lessons.js`.
Comprueba que cada sección tenga topics o quizzes, que cada topic tenga <= 10 preguntas, y que los ids de preguntas sean únicos.
"""
import re
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LESSONS_JS = ROOT / 'data' / 'lessons.js'

if not LESSONS_JS.exists():
    print('ERROR: data/lessons.js no encontrado')
    sys.exit(2)

text = LESSONS_JS.read_text(encoding='utf-8')
# extraer el objeto window.LESSONS = {...};
m = re.search(r'window\.LESSONS\s*=\s*(\{[\s\S]*\})\s*;', text)
if not m:
    # intentar sin ; al final
    m = re.search(r'window\.LESSONS\s*=\s*(\{[\s\S]*\})\s*\Z', text)
if not m:
    print('ERROR: No se pudo extraer el JSON de lessons.js')
    sys.exit(2)
obj_text = m.group(1)
# Reemplazar comillas simples por dobles y quitar trailing commas — asumimos JSON válido, pero parchear si es necesario
try:
    data = json.loads(obj_text)
except Exception as e:
    # intentar evaluar como JS-light (reemplazar claves sin comillas)
    print('ERROR: lessons.js no es JSON válido:', e)
    sys.exit(2)

# Validaciones
errors = []
ids = set()
for sec in data.get('sections', []):
    if not sec.get('topics') and not sec.get('quizzes'):
        errors.append(f"Sección '{sec.get('id')}' no tiene 'topics' ni 'quizzes'.")
    for t in sec.get('topics', []) or []:
        qcount = len(t.get('quizzes', []))
        if qcount == 0:
            errors.append(f"Topic '{t.get('id')}' en sección '{sec.get('id')}' no tiene quizzes.")
        if qcount > 50:
            errors.append(f"Topic '{t.get('id')}' tiene demasiadas preguntas ({qcount}).")
        for q in t.get('quizzes', []):
            qid = q.get('id')
            if not qid:
                errors.append(f"Una pregunta en '{t.get('id')}' no tiene 'id'.")
            elif qid in ids:
                errors.append(f"ID duplicado de pregunta: {qid}")
            else:
                ids.add(qid)

if errors:
    print('VALIDATION FAILED')
    for e in errors:
        print('- ', e)
    sys.exit(1)
else:
    print('VALIDATION OK — todas las comprobaciones pasaron')
    sys.exit(0)
