import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
import { Sprout, Beef, Calendar, Save, ArrowRight } from 'lucide-react'

function App() {
  const [machos, setMachos] = useState('')
  const [femeas, setFemeas] = useState('')
  const [dataCompetencia, setDataCompetencia] = useState('')
  const [loading, setLoading] = useState(false)
  const [listaNascimentos, setListaNascimentos] = useState([])

  useEffect(() => {
    buscarNascimentos()
  }, [])

  async function buscarNascimentos() {
    const { data, error } = await supabase
      .from('nascimentos')
      .select('*')
      .order('data_competencia', { ascending: false })
      .limit(5) // Pega só os 5 últimos para não poluir a tela

    if (!error) setListaNascimentos(data)
  }

  async function registrarNascimento(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('nascimentos').insert([{
      quant_macho: machos ? parseInt(machos) : 0,
      quant_femea: femeas ? parseInt(femeas) : 0,
      data_competencia: dataCompetencia
    }])

    if (error) {
      alert('Erro: ' + error.message)
    } else {
      setMachos('')
      setFemeas('')
      buscarNascimentos()
      alert('Registro salvo com sucesso! 🐮')
    }
    setLoading(false)
  }

  return (
    <div className="dashboard-container">

      {/* MENU LATERAL */}
      <aside className="sidebar">
        <div className="logo">
          <Sprout size={32} />
          <span>Alma Camponesa</span>
        </div>

        <nav>
          <div className="nav-item">
            {/* 2. Substitua o ícone Beef aqui */}
            <Beef size={20} />
            <span>Nascimentos</span>
          </div>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">

        {/* FORMULÁRIO CENTRALIZADO */}
        <div className="form-card">
          <div className="form-header">
            <h2>Registrar Nascimento</h2>
            <p>Preencha os dados de nascimentos mensais.</p>
          </div>

          <form onSubmit={registrarNascimento}>

            <div className="input-group">
              <label><Calendar size={18} /> Data de Competência</label>
              <input
                type="date"
                className="custom-input"
                value={dataCompetencia}
                onChange={(e) => setDataCompetencia(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col">
                <div className="input-group">
                  <label style={{ color: '#1e40af' }}>Qtd. Machos</label>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="0"
                    value={machos}
                    onChange={(e) => setMachos(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div className="input-group">
                  <label style={{ color: '#be185d' }}>Qtd. Fêmeas</label>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="0"
                    value={femeas}
                    onChange={(e) => setFemeas(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Salvando...' : (
                <>
                  <span>Salvar Registro</span>
                  <Save size={20} />
                </>
              )}
            </button>

          </form>
        </div>

        {/* ÚLTIMOS LANÇAMENTOS (Feedback Visual) */}
        <div className="history-section">
          <h3 className="history-title">Últimos Lançamentos</h3>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Machos</th>
                <th>Fêmeas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {listaNascimentos.map((item) => (
                <tr key={item.id}>
                  <td>{item.data_competencia ? new Date(item.data_competencia + 'T12:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td style={{ fontWeight: 'bold', color: '#1e40af' }}>{item.quant_macho}</td>
                  <td style={{ fontWeight: 'bold', color: '#be185d' }}>{item.quant_femea}</td>
                  <td>{item.quant_macho + item.quant_femea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}

export default App