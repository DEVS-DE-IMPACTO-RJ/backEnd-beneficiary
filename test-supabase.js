const supabase = require('./config/supabase');

async function testarConexao() {
  console.log('🔄 Testando conexão com Supabase...\n');

  // Teste 1: Buscar publicações PUBLISHED
  console.log('📢 Testando publicações...');
  const { data: publications, error: errorPub } = await supabase
    .from('publications')
    .select('*')
    .eq('status', 'PUBLISHED');

  if (errorPub) {
    console.error('❌ Erro ao buscar publicações:', errorPub.message);
  } else {
    console.log('✅ Publicações encontradas:', publications.length);
    console.log(JSON.stringify(publications, null, 2));
  }

  // Teste 2: Listar perfis
  console.log('\n👤 Testando perfis...');
  const { data: profiles, error: errorProfiles } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  if (errorProfiles) {
    console.error('❌ Erro ao buscar perfis:', errorProfiles.message);
  } else {
    console.log('✅ Perfis encontrados:', profiles.length);
    console.log(JSON.stringify(profiles, null, 2));
  }

  // Teste 3: Contar beneficiários
  const { count, error: errorCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('tipo_usuario', 'BENEFICIARIO');

  if (errorCount) {
    console.error('❌ Erro ao contar:', errorCount.message);
  } else {
    console.log('\n📊 Total de beneficiários:', count);
  }
}

testarConexao();
